// Kiểm tra mọi liên kết nội bộ trong bản build (dist/): trang đích phải tồn tại, mục (#id) phải có thật.
// Chạy sau `npm run build`:  node scripts/check-links.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BASE = "/it-handbook/";
const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".html")) files.push(p);
  }
})("dist");

const pages = new Map();
for (const f of files) {
  const rel = f.slice("dist/".length);
  const url = BASE + (rel.endsWith("index.html") ? rel.slice(0, -"index.html".length) : rel);
  const html = readFileSync(f, "utf8");
  pages.set(url, { html, ids: new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1])) });
}

let checked = 0;
const errors = [];
for (const [url, { html }] of pages) {
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|\/\/)/.test(href) || /\.(css|js|svg|png|ico|xml|json|woff2?)$/.test(href)) continue;
    const target = new URL(href, "https://x" + url);
    if (!target.pathname.startsWith(BASE)) continue;
    checked++;
    const page = pages.get(target.pathname);
    const frag = decodeURIComponent(target.hash.slice(1));
    if (!page) errors.push(`${url} → ${href}  (không có trang)`);
    else if (frag && frag !== "_top" && !page.ids.has(frag)) errors.push(`${url} → ${href}  (không có mục #${frag})`);
  }
}
console.log(`Đã kiểm ${checked} liên kết trong ${pages.size} trang.`);
if (errors.length) {
  console.error(`${errors.length} liên kết hỏng:\n  ` + [...new Set(errors)].join("\n  "));
  process.exit(1);
}
