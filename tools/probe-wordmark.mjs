import fs from "node:fs";

const file =
	".probe/fe/dsh/node_modules/@deepseek-ai/dsh-web-frontend/dist/assets/index-BXV-oxvX.js";
const source = fs.readFileSync(file, "utf8");
const start = source.indexOf("function vA({");
const body = source.slice(start, start + 12000);
const fills = [...body.matchAll(/fill:"([^"]+)"/g)].map((match) => match[1]);
const elements = [...body.matchAll(/d\.jsxs?\("([\w.]+)",\{[^}]{0,160}/g)].map(
	(match) => match[1],
);
console.log("elements:", [...new Set(elements)]);
console.log("fills:", [...new Set(fills)]);
const cut = body.indexOf("d.jsx(\"rect\"") >= 0 ? "rect" : "no-rect";
console.log("rect?", cut);
const tail = body.slice(body.lastIndexOf("currentColor"), body.lastIndexOf("currentColor") + 700);
console.log("around last currentColor:", tail);
