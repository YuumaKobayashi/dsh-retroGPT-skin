// Extract the shipped client bundles out of the Electron asar archive.
//
// The Harness ships its client packages inside `app.asar`, which only the Host-side
// virtual filesystem can read. The archive itself is an ordinary file, so the
// stylesheet work can be done against the real sources: this script parses the asar
// header and copies the matching files into `.probe/asar/`, where the normal text
// tools can search them.
//
// Usage: node tools/asar-extract.mjs <asar path> <out dir> [path prefix]
import { open, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const [archivePath, outDir, prefix = 'dsh/node_modules/@deepseek-ai/'] = process.argv.slice(2);
if (!archivePath || !outDir) {
  console.error('usage: node tools/asar-extract.mjs <asar> <outDir> [prefix]');
  process.exit(2);
}

const handle = await open(archivePath, 'r');
try {
  const sizeBuffer = Buffer.alloc(8);
  await handle.read(sizeBuffer, 0, 8, 0);
  const headerSize = sizeBuffer.readUInt32LE(4);
  const headerBuffer = Buffer.alloc(headerSize);
  await handle.read(headerBuffer, 0, headerSize, 8);
  // The pickle wraps the JSON in one or two length prefixes depending on the
  // writer, so locate the object itself instead of trusting a fixed offset.
  const headerText = headerBuffer.toString('utf8').replace(/\u0000+$/u, '');
  const jsonStart = headerText.indexOf('{');
  const jsonEnd = headerText.lastIndexOf('}');
  if (jsonStart < 0 || jsonEnd < jsonStart) throw new Error('asar header has no JSON object');
  const header = JSON.parse(headerText.slice(jsonStart, jsonEnd + 1));

  const dataStart = 8 + headerSize;
  const entries = [];
  const walk = (node, base) => {
    for (const [name, value] of Object.entries(node.files ?? {})) {
      const full = base ? `${base}/${name}` : name;
      if (value.files) walk(value, full);
      else if (typeof value.offset === 'string' || typeof value.offset === 'number') entries.push({ path: full, entry: value });
    }
  };
  walk(header, '');

  const wanted = entries.filter((item) => item.path.startsWith(prefix) && item.path.endsWith('.js'));
  let total = 0;
  const listing = [];
  for (const item of wanted) {
    const { entry } = item;
    const size = Number(entry.size);
    if (!size) continue;
    const offset = dataStart + Number(entry.offset);
    const buffer = Buffer.alloc(size);
    const { bytesRead } = await handle.read(buffer, 0, size, offset);
    if (bytesRead !== size) throw new Error(`short read for ${item.path}`);
    const target = join(outDir, item.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, buffer);
    total += size;
    listing.push([item.path, size, buffer[0] === 0 ? ' (leading NUL: offset likely off)' : '']);
  }
  console.log(`extracted ${listing.length} files (${(total / 1024 / 1024).toFixed(1)} MiB)`);
  for (const [file, size, note] of listing) console.log(`  ${(size / 1024).toFixed(0).padStart(7)} KiB  ${file}${note}`);
} finally {
  await handle.close();
}
