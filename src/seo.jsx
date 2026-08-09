import { useEffect } from "react";

export const siteUrl = "https://annaloban.vercel.app";
export const siteName = "Anna Loban";
export const contactEmail = "hello.anna.loban@proton.me";
export const defaultOgImage = "";

const profileLinks = [
  "https://www.linkedin.com/in/annloban/",
  "https://dribbble.com/azzaza",
  "https://t.me/anna_loban",
];

const serviceKeywords = [
  "UX/UI Designer",
  "Landing Page Designer",
  "startup websites",
  "small business websites",
  "EdTech design",
  "SaaS design",
  "Figma",
  "production-ready websites",
];

export const seoRoutes = {
  "/": {
    path: "/",
    title: "Anna Loban | UX/UI Designer & Landing Page Designer",
    description:
      "Anna Loban designs UX/UI, landing pages, and production-ready websites for startups, SaaS, EdTech, and small businesses.",
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

export const plannedSeoRoutes = {
  "/landing-page-design": {
    path: "/landing-page-design",
    planned: true,
    topic: "Landing page design",
  },
  "/startup-landing-page": {
    path: "/startup-landing-page",
    planned: true,
    topic: "Startup landing page design",
  },
  "/small-business-web-design": {
    path: "/small-business-web-design",
    planned: true,
    topic: "Small business web design",
  },
  "/edtech-design": {
    path: "/edtech-design",
    planned: true,
    topic: "EdTech design",
  },
};

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

export function getSeoForPath(pathname) {
  const path = normalizePath(pathname);
  return seoRoutes[path] ?? seoRoutes["/"];
}

function absoluteUrl(path = "/") {
  return `${siteUrl}${path === "/" ? "/" : path}`;
}

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    element.dataset.seoManaged = "true";
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    if (value) {
      element.setAttribute(name, value);
    } else {
      element.removeAttribute(name);
    }
  });
}

function removeManagedMeta(selector) {
  document.head.querySelector(selector)?.remove();
}

function setCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    element.dataset.seoManaged = "true";
    document.head.appendChild(element);
  }

  element.href = url;
}

function buildBreadcrumbSchema(route) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: absoluteUrl("/"),
    },
  ];

  if (route.path !== "/") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: route.breadcrumb,
      item: absoluteUrl(route.path),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function buildSchema(route) {
  const pageUrl = absoluteUrl(route.path);
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const serviceId = `${siteUrl}/#professional-service`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": personId,
      name: "Anna Loban",
      url: siteUrl,
      email: `mailto:${contactEmail}`,
      jobTitle: "UX/UI Designer and Landing Page Designer",
      sameAs: profileLinks,
      knowsAbout: serviceKeywords,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      name: siteName,
      url: siteUrl,
      publisher: { "@id": personId },
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": serviceId,
      name: "Anna Loban UX/UI and landing page design",
      url: siteUrl,
      email: `mailto:${contactEmail}`,
      founder: { "@id": personId },
      areaServed: "Worldwide",
      serviceType: ["UX/UI design", "Landing page design", "Website design", "SaaS design", "EdTech design"],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${siteUrl}/#service`,
      name: "UX/UI design and landing page design",
      provider: { "@id": serviceId },
      serviceType: "UX/UI design, landing page design, and production-ready website design",
      areaServed: "Worldwide",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: route.title,
      description: route.description,
      isPartOf: { "@id": websiteId },
      about: route.path === "/" ? { "@id": serviceId } : { "@id": personId },
      inLanguage: "en",
    },
    buildBreadcrumbSchema(route),
  ];
}

function setJsonLd(route) {
  const schema = buildSchema(route);
  let element = document.head.querySelector('script[type="application/ld+json"][data-seo-schema="page"]');

  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.dataset.seoSchema = "page";
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(schema);
}

function applySeo(route) {
  const url = absoluteUrl(route.path);
  const imageUrl = defaultOgImage ? `${siteUrl}${defaultOgImage}` : "";

  document.documentElement.lang = "en";
  document.title = route.title;

  setMeta('meta[name="description"]', { name: "description", content: route.description });
  setMeta('meta[name="robots"]', { name: "robots", content: route.robots });
  setCanonical(url);

  setMeta('meta[property="og:title"]', { property: "og:title", content: route.title });
  setMeta('meta[property="og:description"]', { property: "og:description", content: route.description });
  setMeta('meta[property="og:type"]', { property: "og:type", content: route.type });
  setMeta('meta[property="og:url"]', { property: "og:url", content: url });
  setMeta('meta[property="og:site_name"]', { property: "og:site_name", content: siteName });
  setMeta('meta[property="og:locale"]', { property: "og:locale", content: "en_US" });

  setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: imageUrl ? "summary_large_image" : "summary" });
  setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: route.title });
  setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: route.description });

  if (imageUrl) {
    setMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });
    setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });
  } else {
    removeManagedMeta('meta[property="og:image"]');
    removeManagedMeta('meta[name="twitter:image"]');
  }

  setJsonLd(route);
}

export function SeoManager({ pathname }) {
  useEffect(() => {
    applySeo(getSeoForPath(pathname));
  }, [pathname]);

  return null;
}
