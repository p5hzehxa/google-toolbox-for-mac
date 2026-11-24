import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const sourceFiles = ["README.md", "USING.md"].filter((file) => {
  try { readFileSync(file); return true; } catch { return false; }
});
const markdown = sourceFiles.map((file) => readFileSync(file, "utf8")).join("\n\n---\n\n");
const body = sanitizeHtml(marked.parse(markdown), {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "h1", "h2", "h3", "h4", "table", "thead", "tbody", "tr", "th", "td", "pre", "code"],
  allowedAttributes: { a: ["href", "name", "target", "rel"], img: ["src", "alt", "title", "width", "height"], "*": ["id"] },
  allowedSchemes: ["http", "https", "mailto"]
});
const title = process.env.SITE_TITLE || "Project Documentation";
const description = process.env.SITE_DESCRIPTION || "Project documentation and resources.";
mkdirSync("dist", { recursive: true });
writeFileSync("dist/index.html", `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${description.replaceAll("&", "&amp;").replaceAll('"', "&quot;")}">
<title>${title.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</title>
<style>
:root{color-scheme:light dark;font-family:system-ui,-apple-system,Segoe UI,sans-serif}
body{margin:0;background:Canvas;color:CanvasText;line-height:1.65}
header{padding:2.5rem max(1.25rem,calc((100% - 920px)/2));background:color-mix(in srgb,CanvasText 5%,Canvas);border-bottom:1px solid color-mix(in srgb,CanvasText 15%,Canvas)}
main{max-width:920px;margin:2rem auto;padding:0 1.25rem 4rem}
h1,h2,h3{line-height:1.25}a{color:LinkText}img{max-width:100%;height:auto}pre{overflow:auto;padding:1rem;border-radius:.6rem;background:color-mix(in srgb,CanvasText 8%,Canvas)}code{font-family:ui-monospace,monospace}table{border-collapse:collapse;display:block;overflow-x:auto}th,td{border:1px solid color-mix(in srgb,CanvasText 20%,Canvas);padding:.5rem .75rem}blockquote{border-left:3px solid color-mix(in srgb,CanvasText 25%,Canvas);margin-left:0;padding-left:1rem}
</style>
</head>
<body><header><strong>${title}</strong><div>${description}</div></header><main>${body}</main></body></html>`);
console.log(`Built dist/index.html from ${sourceFiles.join(", ")}`);
