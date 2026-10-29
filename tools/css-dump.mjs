// Pretty-print the CSS modules that the shipped client bundles embed as JS strings.
//
// Usage: node tools/css-dump.mjs <file> [selector-substring ...]
// With no substring, every selector is printed.
import { readFile } from 'node:fs/promises';

const [file, ...needles] = process.argv.slice(2);
if (!file) {
  console.error('usage: node tools/css-dump.mjs <file> [selector-substring ...]');
  process.exit(2);
}

const source = await readFile(file, 'utf8');
const pattern = /const\s+(css(?:\$\d+)?)\s*=\s*"((?:[^"\\]|\\.)*)"/g;
let match;
let total = 0;
while ((match = pattern.exec(source)) !== null) {
  const [name, body] = [match[1], match[2]];
  let css;
  try {
    css = JSON.parse(`"${body}"`);
  } catch {
    continue;
  }
  const rules = css.split('}').map((chunk) => chunk.trim()).filter(Boolean);
  const hits = rules.filter((rule) => {
    if (!needles.length) return true;
    const selector = rule.split('{')[0] ?? '';
    return needles.some((needle) => selector.includes(needle));
  });
  if (!hits.length) continue;
  console.log(`\n=== ${name} (${css.length} chars) matches=${hits.length}`);
  for (const rule of hits) {
    const index = rule.indexOf('{');
    if (index < 0) {
      console.log(rule);
      continue;
    }
    const selector = rule.slice(0, index).trim();
    const declarations = rule
      .slice(index + 1)
      .split(';')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .join(';\n  ');
    console.log(`${selector} {\n  ${declarations};\n}`);
    total += 1;
  }
}
console.log(`\n# ${total} rule(s) printed`);
