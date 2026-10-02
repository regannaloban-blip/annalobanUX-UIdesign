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
    overview: "24COLAB: RESEARCH, CONTENT WRITING, AND EDITING FOR ENTERPRISES. OFFERS DEDICATED TEAMS FOR ORDERS OR DEDICATED TEAM SUBSCRIPTIONS.",
    challenge: "THE WEBSITE NEEDED TO CLEARLY COMMUNICATE 24COLAB’S VALUE PROPOSITION AND DIFFERENTIATE ITS TWO SERVICE MODELS: ONE-OFF PROJECT ORDERS AND ONGOING SUPPORT BY A DEDICATED TEAM.",
    solution: "THE SITE STRUCTURE GUIDES VISITORS FROM A CLEAR SERVICE OVERVIEW TO CHOOSING THE RIGHT ENGAGEMENT MODEL—WHETHER PLACING A SINGLE ORDER OR OUTSOURCING REGULAR CONTENT PRODUCTION.",
    caseAssets: { visual: "24colab-logo", screens: "24colab-screens" },
    features: [
      { icon: "cohesive", title: "Cohesive visual system", description: "Curated illustrations and custom icons create a clean, cohesive, and professional brand identity across all pages." },
      { icon: "dual", title: "Dual engagement flows", description: "Clear, dedicated UI pathways for both one-off task placement and ongoing team subscriptions." },
      { icon: "transparent", title: "Transparent workflow", description: "Interactive UI elements clearly show how the platform matches talent, reviews quality, and manages projects." },
      { icon: "scalable", title: "Scalable design system", description: "A modular UI kit that allows the client to quickly build and launch new pages without breaking the layout." },
    ],
    relatedPath: "/work/smart-business-intelligence-website",
  },
  {
    path: "/work/smart-business-intelligence-website",
    name: "Smart Business Intelligence",
    projectType: "Corporate Service Website",
    industry: "Business Intelligence & Analytics",
    scope: "UX/UI web design",
    websiteGoal: "Establish Online Presence & Trust",
    title: "Smart Business Intelligence website | Anna Loban",
    description: "UX/UI web design case for a business intelligence consultancy website.",
    image: "smart-business-intelligence",
    imageAlt: "Smart Business Intelligence website interface",
    liveUrl: "https://smartbusinessintelligence.co.uk",
    overview: "SMART BUSINESS INTELLIGENCE: DATA-DRIVEN SOLUTIONS AND BUSINESS ANALYTICS ENGINEERED FOR B2B CONVERSION AND SCALABLE GROWTH.",
    challenge: "SMART BUSINESS INTELLIGENCE REQUIRED A STANDALONE DIGITAL ASSET TO SEPARATE ITS COMMERCIAL PRESENCE WITHIN A MULTI-COMPANY OPERATIONAL STRUCTURE. THE CORE OBJECTIVE WAS TO BUILD BRAND AUTHORITY INDEPENDENTLY WITHOUT RELYING ON PARENT COMPANY CREDENTIALS.",
    challengeDetail: "THE PRIMARY DESIGN CHALLENGE WAS TRANSFORMING HEAVY, ABSTRACT DATA ANALYTICAL SERVICES INTO A CLEAR COMMERCIAL PROPOSITION. WE HAD TO ELIMINATE SALES FRICTION FOR ENTERPRISE CLIENTS, ADDRESS CORE BUSINESS PAIN POINTS UPFRONT, AND CONSTRUCT AN INTUITIVE FUNNEL THAT TURNS EXECUTIVE SITE VISITS INTO QUALIFIED INBOUND LEADS.",
    solution: "WE STRUCTURED A PERFORMANCE-DRIVEN WEB ARCHITECTURE FOCUSED ON COMMERCIAL CLARITY AND DIRECT LEAD ACQUISITION. THE PAGE FLOWS FROM IDENTIFYING INEFFICIENCIES TO PRESENTING TAILORED ANALYTICAL FRAMEWORKS.",
    solutionDetail: "LOW-FRICTION CONSULTATION TOUCHPOINTS AND TRANSPARENT SERVICE BREAKDOWNS TURN THE SITE INTO AN AUTOMATED SALES ASSISTANT, PROMPTING IMMEDIATE DECISION-MAKING.",
    caseAssets: { visual: "smart-business-logo", screens: "smart-business-screens" },
    features: [
      { icon: "sbi-conversion", title: "DIRECT-RESPONSE CONVERSION FUNNEL", description: "STRATEGICALLY PLACED CONTACT NODES ENGINEERED TO CONVERT HIGH-INTENT B2B VISITORS INTO QUALIFIED SALES OPPORTUNITIES." },
      { icon: "sbi-mapping", title: "ENTERPRISE SERVICE MAPPING", description: "A STREAMLINED NAVIGATION HIERARCHY CATEGORIZING COMPLEX ANALYTICS INTO CLEAR BUSINESS OUTCOMES FOR EXECUTIVES." },
      { icon: "sbi-architecture", title: "SCALABLE COMPONENT ARCHITECTURE", description: "A MODULAR UI FRAMEWORK CRAFTED FOR RAPID EXPANSION AND SEAMLESS LAUNCHES OF NEW CAMPAIGN PAGES." },
      { icon: "sbi-visual-system", title: "DATA-CENTRIC VISUAL SYSTEM", description: "A PRECISE VISUAL LANGUAGE WITH DARK ELEMENTS AND STRUCTURED GRIDS THAT COMMUNICATES SECURITY AND ANALYTICAL ACCURACY." },
    ],
    relatedPath: "/work/skyliner-commercial-property-website",
  },
  {
    path: "/work/skyliner-commercial-property-website",
    name: "Skyliner",
    projectType: "Commercial real estate portal",
    industry: "Commercial real estate & proptech",
    scope: "Information architecture, UX/UI design",
    websiteGoal: "Boost office leasing leads",
    title: "Skyliner commercial property website | Anna Loban",
    description: "UX/UI web design case for a commercial property website.",
    image: "skyliner",
    imageAlt: "Skyliner commercial property website interface",
    liveUrl: "https://skyliner.rv.ua/",
    overview: "SKYLINER: Modern Business Center Digital Showcase Built for High-Occupancy Commercial Leasing.",
    challenge: "The original website layout was outdated, featuring cluttered navigation and unstructured technical specs that failed to convert visitors. SKYLINER needed a total UX/UI overhaul to replace the legacy system, separate its digital identity, and align the online presence with a modern Class-A business center.",
    challengeDetail: "The key challenge was restructuring legacy content into a clean, modern framework that eliminates user friction and drives active leasing inquiries.",
    solution: "We completely transformed the outdated platform into a high-converting digital showcase. The new architecture streamlines the user journey, moving from legacy text walls to interactive space planning and clear value propositions.",
    solutionDetail: "By replacing the old static structure with intuitive floor navigation and strategic CTA nodes, the redesigned site now functions as an automated sales channel for corporate tenants.",
    caseAssets: { visual: null, screens: "skyliner-screens" },
    features: [
      { icon: "skyliner-leasing", title: "Redesigned leasing funnel", description: "Replacement of legacy contact forms with strategically placed CTA triggers designed to convert B2B visitors into qualified viewing leads." },
      { icon: "skyliner-navigation", title: "Modern space navigation", description: "Complete overhaul of outdated specs into an intuitive UI showcasing interactive floor plans and infrastructure benefits." },
      { icon: "skyliner-system", title: "Scalable component system", description: "A new modular UI framework replacing rigid legacy layouts, allowing fast updates for available rental spaces." },
      { icon: "skyliner-redesign", title: "High-trust B2B redesign", description: "A modernized visual identity with high-contrast grids and clean typography that reinforces premium architecture and corporate prestige." },
    ],
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
    overview: "YourDissertation: Redesign of an Academic Research Platform Built for Trust and Conversion.",
    challenge: "The main objective was to create a new, high-converting digital platform for YourDissertation from scratch. Operating in a high-stakes academic domain, the brand needed a transparent web presence that immediately builds credibility with students and research profession",
    challengeDetail: "The primary design challenge was translating complex ordering variables—such as academic tier, strict deadlines, and subject specifications—into an effortless, low-friction user experience.",
    solution: "We engineered a clean, conversion-focused EdTech platform designed to streamline client acquisition. The information architecture organizes diverse academic services into clear categories, guiding users directly from initial estimation to order placement.",
    solutionDetail: "By designing an interactive pricing calculator and a seamless multi-step checkout flow, the platform eliminates user drop-offs and drives direct conversions.",
    caseAssets: { visual: "your-dissertation-logo", screens: "your-dissertation-screens" },
    features: [
      { icon: "yd-calculator", title: "REAL-TIME ORDER CALCULATOR", description: "An intuitive pricing module allowing clients to instantly calculate project costs based on page count, academic level, and delivery timeline." },
      { icon: "yd-flow", title: "HIGH-CONVERSION CHECKOUT FLOW", description: "A streamlined multi-step ordering process engineered to minimize drop-offs and accelerate order submission." },
      { icon: "yd-flow", title: "MODULAR SERVICE ARCHITECTURe", description: "A scalable UI framework categorizing diverse research services for fast navigation and clear value presentation." },
      { icon: "yd-flow", title: "TRUST-DRIVEN VISUAL IDENTITY", description: "A crisp, modern visual language with structured content cards and security indicators that reinforce confidentiality, originality, and institutional reliability." },
    ],
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
