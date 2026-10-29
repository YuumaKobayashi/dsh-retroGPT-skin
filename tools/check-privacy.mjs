// A local release guard. Reports locations only, never matched values.
// Heuristics supplement manual review; they cannot establish anonymity.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const excluded = new Set(['.git', '.probe', 'node_modules', '.npm-cache', '__pycache__']);
const rules = [
  ['personal Windows path', /\b[A-Za-z]:[\\/]+Users[\\/]+[^\\/\s"']+/i],
  ['personal Unix path', /\/(?:Users|home)\/[^/\s"']+\//],
  ['local attachment identifier', /attachments[\\/]+v\d+[\\/]+objects[\\/]+[a-f0-9]{2}[\\/]+[a-f0-9]{64}/i],
  ['email address', /\b[A-Z0-9._%+-]+@(?![A-Z0-9.-]*\.invalid\b)[A-Z0-9.-]+\.[A-Z]{2,}\b/i],
  ['possible mobile number', /(?<!\w)1[3-9]\d{9}(?!\w)/],
  ['possible identity number', /(?<!\w)\d{17}[\dX](?!\w)/i],
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ['access token', /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|npm_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16}|sk-(?:proj-)?[A-Za-z0-9_-]{20,})\b/],
  ['credential in URL', /https?:\/\/[^\s/"']+:[^\s/"']+@/i],
  ['assigned credential', /(?:api[_-]?key|password|passwd|secret|access[_-]?token)\s*["']?\s*[:=]\s*["'][^"'\s]{8,}["']/i],
];
const problems = [];
let files = 0;
let images = 0;

function inspect(file) {
  const label = relative(root, file);
  if (/^(?:\.env(?:\..*)?|\.npmrc)$|\.(?:pem|key|p12|pfx)$/i.test(label.split(/[\\/]/).at(-1))) {
    problems.push(`${label}: private configuration must not be in a release checkout`);
    return;
  }
  const content = readFileSync(file, 'utf8');
  // Encoded image pixels are not text; inspect PNG metadata separately below.
  const text = content.replace(/data:image\/png;base64,[A-Za-z0-9+/=]+/g, (uri) => {
    const png = Buffer.from(uri.slice(uri.indexOf(',') + 1), 'base64');
    if (png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
      problems.push(`${label}: invalid embedded PNG`);
      return '';
    }
    let offset = 8;
    let ended = false;
    while (offset + 12 <= png.length) {
      const size = png.readUInt32BE(offset);
      const type = png.toString('ascii', offset + 4, offset + 8);
      if (offset + size + 12 > png.length) break;
      if (!['IHDR', 'IDAT', 'IEND', 'PLTE', 'tRNS', 'sRGB', 'gAMA', 'cHRM', 'pHYs'].includes(type)) {
        problems.push(`${label}: embedded PNG has unreviewed metadata (${type})`);
      }
      offset += size + 12;
      if (type === 'IEND') { ended = offset === png.length; break; }
    }
    if (!ended) problems.push(`${label}: embedded PNG has trailing or invalid data`);
    images += 1;
    return '';
  });
  for (const [name, pattern] of rules) {
    const match = pattern.exec(text);
    if (match) {
      const line = text.slice(0, match.index).split('\n').length;
      problems.push(`${label}:${line}: ${name}`);
    }
  }
  files += 1;
}

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name) || entry.name.endsWith('.tgz')) continue;
    const file = join(directory, entry.name);
    if (entry.isSymbolicLink()) problems.push(`${relative(root, file)}: review symbolic link before release`);
    else if (entry.isDirectory()) walk(file);
    else inspect(file);
  }
}

walk(root);
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
for (const key of ['author', 'contributors', 'maintainers', '_npmUser', 'repository', 'homepage', 'bugs']) {
  if (pkg[key]) problems.push(`package.json: review identity-bearing metadata (${key})`);
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Privacy guard passed: ${files} files, ${images} embedded PNGs. Manual review is still required.`);
}
