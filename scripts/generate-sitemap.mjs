import { writeFile } from "node:fs/promises";
import { projects } from "../src/content/projects.js";

const siteUrl = "https://annaloban.vercel.app";
const paths = ["/", ...projects.map((project) => project.path)];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join("\n")}\n</urlset>\n`;

await writeFile(new URL("../public/sitemap.xml", import.meta.url), xml);
