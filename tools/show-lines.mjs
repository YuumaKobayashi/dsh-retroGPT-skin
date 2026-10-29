import { readFileSync } from "node:fs";

const file = process.argv[2];
const from = Number(process.argv[3] ?? 6960);
const to = Number(process.argv[4] ?? 7020);
const lines = readFileSync(file, "utf8").split("\n");
for (let i = from; i <= to && i <= lines.length; i += 1) {
	console.log(`${i}: ${lines[i - 1]}`);
}
