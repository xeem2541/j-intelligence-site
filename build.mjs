// Builds the site into dist/: every page in src/pages gets the shared head, CSS, header, footer and scripts.
// Run: node build.mjs   (Netlify and GitHub Pages run it on every push)
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
// CRLF (Windows checkouts) is normalised so every page builds the same everywhere
const read = p => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const src = p => read(join(here, "src", p));
const out = join(here, "dist");

// every .html under src/pages, keeping folders (services/ai-chatbot/index.html -> /services/ai-chatbot/)
const pages = [];
const walk = dir => readdirSync(dir).forEach(f => {
  const p = join(dir, f);
  if (statSync(p).isDirectory()) walk(p); else if (f.endsWith(".html")) pages.push(p);
});
walk(join(here, "src", "pages"));

// <!--include parts/x.html--> pastes a shared file (e.g. package cards used on several pages)
const include = s => s.replace(/<!--include ([\w/.-]+)-->\n/g, (m, p) => src(p));

const fill = (s, vars) => s.replace(/\{\{(\w+)\}\}/g, (m, k) => {
  if (!(k in vars)) throw new Error(`missing {{${k}}}`);
  return vars[k];
});

// canonical host, same as meta.html
const site = "https://j-intelligence.netlify.app";
// home page structured data: who runs the site (only facts shown on the site itself)
const jsonld = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${site}/#org`, name: "J Intelligence", url: `${site}/`, logo: `${site}/og.jpg`,
      description: "รับทำ AI Chatbot เว็บไซต์ + AI และคอนเทนต์ AI สำหรับร้านค้าและ SME",
      founder: { "@type": "Person", name: "Jakkarin Permchob" },
      sameAs: ["https://fastwork.com/user/jakkarin.dev"] },
    { "@type": "WebSite", "@id": `${site}/#website`, url: `${site}/`, name: "J Intelligence", inLanguage: "th", publisher: { "@id": `${site}/#org` } },
  ],
});

rmSync(out, { recursive: true, force: true });
for (const file of pages) {
  const raw = read(file);
  const m = raw.match(/^<!--page (\{.*\}) -->\n/);
  if (!m) throw new Error(`${file}: first line must be <!--page {json} -->`);
  const page = JSON.parse(m[1]);
  const rel = relative(join(here, "src", "pages"), file).split(sep).join("/");
  const depth = rel.split("/").length - 1;
  // links stay relative so the site works on Netlify (/) and GitHub Pages (/j-intelligence-site/)
  const vars = { ...page, root: depth ? "../".repeat(depth) : "./" };
  const js = page.home
    ? ["common-a", "home-1", "kinetic", "home-2", "common-b", "home-3", "common-c"]
    : ["common-a", "kinetic", "common-b", "common-c"];
  const html = [
    "<!doctype html>",
    '<html lang="th">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    fill(src("meta.html"), vars).replace(/\n$/, ""),
    ...(page.home ? [`<script type="application/ld+json">${jsonld}</script>`] : []),
    src("head-end.html").replace(/\n$/, ""),
    "<style>",
    src("site.css").replace(/\n$/, ""),
    "</style>",
    "</head>",
    "<body>",
    fill(src("sprite.html"), vars).replace(/\n$/, ""),
    "",
    fill(src("header.html"), vars).replace(/\n$/, ""),
    "",
    fill(include(raw.slice(m[0].length)), vars).replace(/\n$/, ""),
    "",
    fill(src("end.html"), vars).replace(/\n$/, ""),
    "",
    "<script>",
    "(() => {",
    js.map(n => src(`js/${n}.js`).replace(/\n$/, "")).join("\n"),
    "})();",
    "</script>",
    "</body>",
    "</html>",
  ].join("\n") + "\n";
  const dest = join(out, rel);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, html);
}
copyFileSync(join(here, "og.jpg"), join(out, "og.jpg"));

// sitemap + robots for search engines; canonical URLs point at Netlify
const paths = pages.map(f => JSON.parse(read(f).match(/^<!--page (\{.*\}) -->/)[1]).path).sort();
writeFileSync(join(out, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + paths.map(p => `  <url><loc>${site}${p}</loc></url>`).join("\n") + "\n</urlset>\n");
writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
console.log(`built ${pages.length} page(s) into dist/`);
