export function normalizePath(pathname = "/") {
  return pathname === "/" ? "/" : pathname.replace(/\/+$/, "") || "/";
}

export const projects = [
  {
    path: "/work/24colab-content-services-website",
    name: "24 colab",
    projectType: "B2B service website",
    industry: "Content services",
    scope: "UX/UI web design",
    websiteGoal: "Present services clearly",
    title: "24 colab content services website | Anna Loban",
    description: "UX/UI web design case for a B2B content services website.",
    image: "24colab",
    imageAlt: "24 colab website interface",
    liveUrl: "https://24colab.com/",
    overview: "A website for presenting content services, support options, and examples of the offer.",
    challenge: "The visible interface needs to introduce the service offer and make the available ways of working easy to compare.",
    solution: "The page structure moves from the offer overview to service options and supporting interface examples.",
    features: ["Cohesive visual system", "Dual engagement flows", "Transparent workflow", "Scalable design system"],
    relatedPath: "/work/smart-business-intelligence-website",
  },
  {
    path: "/work/smart-business-intelligence-website",
    name: "Smart Business Intelligence",
    projectType: "Consultancy website",
    industry: "Business intelligence",
    scope: "UX/UI web design",
    websiteGoal: "Explain complex services clearly",
    title: "Smart Business Intelligence website | Anna Loban",
    description: "UX/UI web design case for a business intelligence consultancy website.",
    image: "smart-business-intelligence",
    imageAlt: "Smart Business Intelligence website interface",
    liveUrl: "https://smartbusinessintelligence.co.uk",
    overview: "A consultancy website for presenting business intelligence services and expertise.",
    challenge: "The visible interface needs to make a complex consultancy offer easier to understand in sequence.",
    solution: "The page uses a clear hierarchy to introduce the consultancy and its service information progressively.",
    features: ["Clear service hierarchy", "Focused visual narrative", "Scannable content blocks", "Responsive interface"],
    relatedPath: "/work/skyliner-commercial-property-website",
  },
  {
    path: "/work/skyliner-commercial-property-website",
    name: "Skyliner",
    projectType: "Commercial property website",
    industry: "Real estate",
    scope: "UX/UI web design",
    websiteGoal: "Help visitors explore the space",
    title: "Skyliner commercial property website | Anna Loban",
    description: "UX/UI web design case for a commercial property website.",
    image: "skyliner",
    imageAlt: "Skyliner commercial property website interface",
    liveUrl: "https://skyliner.rv.ua/",
    overview: "A commercial property website that introduces the location and its available spaces.",
    challenge: "The visible interface needs to help visitors understand a large place and navigate its information.",
    solution: "The page groups property information into a hierarchy that supports an overview before details.",
    features: ["Space-first hierarchy", "Clear information groups", "Visual property context", "Responsive layout"],
    relatedPath: "/work/your-dissertation-order-flow",
  },
  {
    path: "/work/your-dissertation-order-flow",
    name: "Your Dissertation",
    projectType: "Service website",
    industry: "Academic services",
    scope: "UX/UI web design",
    websiteGoal: "Make the order process clear",
    title: "Your Dissertation order flow | Anna Loban",
    description: "UX/UI web design case for an academic services website and order flow.",
    image: "your-dissertation",
    imageAlt: "Your Dissertation website interface",
    liveUrl: "https://yourdissertation.com",
    overview: "A service website that presents an academic support offer and the steps toward an order.",
    challenge: "The visible interface needs to reduce uncertainty before a visitor starts an order.",
    solution: "The page organizes service information, pricing context, and order steps into a clear sequence.",
    features: ["Order-flow clarity", "Pricing context", "Structured service details", "Responsive interface"],
    relatedPath: "/work/24colab-content-services-website",
  },
].map((project) => ({
  ...project,
  meta: {
    "Project type": project.projectType,
    Industry: project.industry,
    "Scope of work": project.scope,
    "Website goal": project.websiteGoal,
  },
}));

export function getProjectByPath(pathname) {
  const path = normalizePath(pathname);
  return projects.find((project) => project.path === path) ?? null;
}

export function isProjectPath(pathname) {
  return getProjectByPath(pathname) !== null;
}

export function getRouteKind(pathname) {
  const path = normalizePath(pathname);
  if (path === "/") return "home";
  if (path === "/privacy") return "privacy";
  return isProjectPath(path) ? "project" : "not-found";
}
