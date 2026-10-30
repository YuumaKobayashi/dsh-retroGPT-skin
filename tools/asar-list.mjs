// Lists app.asar entries whose path matches a substring, so a specific locale file
// or package can be located without extracting the whole archive.
// Usage: node tools/asar-list.mjs "<app.asar>" "<substring>" [limit]
import fs from "node:fs";

const [archive, needle = "", limitArg] = process.argv.slice(2);
const limit = Number(limitArg ?? 200);

const fd = fs.openSync(archive, "r");
const head = Buffer.alloc(16);
fs.readSync(fd, head, 0, 16, 0);
const size = head.readUInt32LE(12);
const header = Buffer.alloc(size);
fs.readSync(fd, header, 0, size, 16);
const text = header.toString("utf8");
const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));

const rows = [];
const walk = (node, prefix) => {
  for (const [name, entry] of Object.entries(node.files ?? {})) {
    const path = `${prefix}/${name}`;
    if (entry.files) walk(entry, path);
    else if (path.includes(needle)) rows.push(`${path}\t${entry.size ?? 0}`);
  }
};
walk(json, "");
fs.closeSync(fd);
for (const row of rows.slice(0, limit)) console.log(row);
console.log(`total ${rows.length}`);
