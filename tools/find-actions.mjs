import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
	console.error("usage: node tools/find-actions.mjs <client.js>");
	process.exit(1);
}
const text = readFileSync(file, "utf8");

const map = new Map();
for (const match of text.matchAll(/"actions":\s*"([A-Za-z0-9_]+_actions)"/g)) {
	map.set(match[1], (map.get(match[1]) ?? 0) + 1);
}

for (const name of map.keys()) {
	const module = name.replace(/_actions$/, "");
	const cssUses = [...text.matchAll(new RegExp(`\\.${name}\\s*\\{[^}]*\\}`, "g"))].map((m) => m[0]);
	const jsxUses = [...text.matchAll(new RegExp(`(\\w+)_module_css_default\\.actions`, "g"))];
	const lineNos = [...text.matchAll(new RegExp(`${module}_module_css_default\\.actions`, "g"))].map(
		(m) => text.slice(0, m.index).split("\n").length,
	);
	console.log(`### ${name}`);
	for (const rule of cssUses) console.log("  css:", rule.replace(/\s+/g, " ").slice(0, 400));
	console.log("  jsx lines:", lineNos.slice(0, 10).join(", ") || "(none)");
	console.log("  total module.actions refs:", jsxUses.length);
}
