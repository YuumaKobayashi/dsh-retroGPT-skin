import { readFileSync } from "node:fs";

const target =
	process.argv[2] ??
	".probe/asar/dsh/node_modules/@deepseek-ai/dsh-client-ui-conversation/lib/client.js";
const needle = process.argv[3] ?? "composerSeat";
const source = readFileSync(target, "utf8");

/* the bundle keeps each CSS module as `const css$N = "…"`; pull them all out */
const re = /const css\$(\d+) = "((?:[^"\\]|\\.)*)";/g;
let match;
let found = 0;
while ((match = re.exec(source)) !== null) {
	const css = JSON.parse('"' + match[2] + '"');
	if (!css.includes(needle)) continue;
	found += 1;
	const rules = css.split("}").filter((rule) => rule.includes(needle) || rule.includes("gradient") || rule.includes("mask"));
	if (!rules.length) continue;
	console.log(`--- css$${match[1]} ---`);
	for (const rule of rules) console.log(rule.trim() + "}");
}
console.log(`blocks matching "${needle}": ${found}`);
