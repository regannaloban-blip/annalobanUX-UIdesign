import { getProjectByPath, normalizePath } from "./content/projects.js";

export const seoRoutes = {
  "/": {
    path: "/",
    title: "Anna Loban | UX/UI Designer & Landing Page Designer",
    description: "Anna Loban designs UX/UI, landing pages, and production-ready websites for startups, SaaS, EdTech, and small businesses.",
    robots: "index, follow",
    type: "website",
    breadcrumb: "Home",
    sitemap: true,
  },
  "/privacy": {
    path: "/privacy",
    title: "Privacy Policy | Anna Loban",
    description: "Privacy policy for the Anna Loban portfolio contact form.",
    robots: "noindex, follow",
    type: "article",
    breadcrumb: "Privacy Policy",
    sitemap: false,
  },
};

export function getSeoForPath(pathname) {
  const project = getProjectByPath(pathname);
  if (project) return { path: project.path, title: project.title, description: project.description, robots: "index, follow", type: "article", breadcrumb: project.name, sitemap: true };
  return seoRoutes[normalizePath(pathname)] ?? seoRoutes["/"];
}
