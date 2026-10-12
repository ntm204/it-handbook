// Sinh public/glossary.json từ bảng trong thuat-ngu.md (để hiện giải thích khi rê chuột)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const md = readFileSync("src/content/docs/thuat-ngu.md", "utf8");
const terms = [];
for (const line of md.split("\n")) {
  const m = line.match(/^\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/);
  if (m) terms.push({ term: m[1], vi: m[2], def: m[3].replace(/\[(.+?)\]\(.+?\)/g, "$1").replace(/`/g, "") });
}
terms.sort((a, b) => b.term.length - a.term.length);
mkdirSync("public", { recursive: true });
writeFileSync("public/glossary.json", JSON.stringify(terms));
console.log(`glossary.json: ${terms.length} thuật ngữ`);
