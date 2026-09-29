import React, { useEffect, useRef, useState } from "react";
import { TopLinks } from "../components/TopLinks.jsx";
import { HoverText } from "../components/PortfolioPrimitives.jsx";
import { projectMedia } from "../content/projectMedia.js";
import { getProjectByPath } from "../content/projects.js";
import logoVector from "../assets/figma/24colab/logo-vector.svg";
import logoVectorOne from "../assets/figma/24colab/logo-vector-1.svg";
import logoGroup from "../assets/figma/24colab/logo-group.svg";
import nextSmartBusinessIntelligence from "../assets/figma/24colab/next-smart-business-intelligence.png";
import featureCohesive from "../assets/figma/24colab/feature-cohesive.svg";
import featureDual from "../assets/figma/24colab/feature-dual.svg";
import featureTransparent from "../assets/figma/24colab/feature-transparent.svg";
import featureScalable from "../assets/figma/24colab/feature-scalable.svg";
import contentOutsourcing from "../assets/figma/24colab/screens-content-outsourcing.png";
import faq from "../assets/figma/24colab/screens-faq.png";
import managedServices from "../assets/figma/24colab/screens-managed-services.png";
import mobileMenuBackIcon from "../assets/figma/24colab/menu-back.svg";
import "./CasePage.css";

const logoBackgroundComponent = "https://www.figma.com/api/mcp/asset/89ae5c2e-47da-4d83-829c-8c007708ac9e.svg";
const projectBackIcon = "https://www.figma.com/api/mcp/asset/3bd46429-db93-48f2-881b-62392cbbe29e.svg";

const colabFeatures = [
  [[featureCohesive], "Cohesive visual system", "Curated illustrations and custom icons create a clean, cohesive, and professional brand identity across all pages."],
  [[featureDual], "Dual engagement flows", "Clear, dedicated UI pathways for both one-off task placement and ongoing team subscriptions."],
  [[featureTransparent], "Transparent workflow", "Interactive UI elements clearly show how the platform matches talent, reviews quality, and manages projects."],
  [[featureScalable], "Scalable design system", "A modular UI kit that allows the client to quickly build and launch new pages without breaking the layout."],
];

const colabMobileMenuItems = [
  ["Work", "/#works"],
  ["Services", "/#about"],
  ["Contact", "/#contact-form"],
];

function ColabCasePage({ footer }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuOpening, setIsMobileMenuOpening] = useState(false);
  const menuOpenTimer = useRef();

  const openMobileMenu = () => {
    setIsMobileMenuOpening(true);
    window.clearTimeout(menuOpenTimer.current);
    menuOpenTimer.current = window.setTimeout(() => {
      setIsMobileMenuOpen(true);
      setIsMobileMenuOpening(false);
    }, 240);
  };

  useEffect(() => () => window.clearTimeout(menuOpenTimer.current), []);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMobileMenuOpen]);

  return (
    <main className="case-page colab-case" aria-label="24 colab project case study">
      <header className="colab-topbar">
        <a href="/" className="colab-back"><img src={projectBackIcon} alt="" /><span className="colab-back__desktop"><HoverText>Project</HoverText></span><span className="colab-back__mobile"><HoverText>Anna Loban</HoverText></span></a>
        <TopLinks />
        <button type="button" className="colab-menu-toggle" aria-expanded={isMobileMenuOpen || isMobileMenuOpening} aria-controls="colab-mobile-menu" aria-label="Open menu" disabled={isMobileMenuOpening} onClick={openMobileMenu}>
          <span className={`colab-menu-toggle__icon${isMobileMenuOpening ? " colab-menu-toggle__icon--opening" : ""}`} aria-hidden="true"><span /><span /><span /></span>
        </button>
      </header>

      {isMobileMenuOpen && <div className="colab-mobile-menu" role="presentation" onClick={() => setIsMobileMenuOpen(false)}>
        <nav id="colab-mobile-menu" className="colab-mobile-menu__panel" aria-label="Mobile menu" onClick={(event) => event.stopPropagation()}>
          <div className="colab-mobile-menu__header">
            <a href="/" className="colab-mobile-menu__brand"><img src={mobileMenuBackIcon} alt="" /><span>Anna Loban</span></a>
            <button type="button" className="colab-mobile-menu__toggle" aria-label="Close menu" onClick={() => setIsMobileMenuOpen(false)}><span className="colab-menu-toggle__icon colab-menu-toggle__icon--active" aria-hidden="true"><span /></span></button>
          </div>
          <div className="colab-mobile-menu__content">
            <p>Turn complex ideas into<br />clear digital systems.</p>
            <ol>{colabMobileMenuItems.map(([label, href], index) => <li key={label}><a href={href} onClick={() => setIsMobileMenuOpen(false)}><span>{label}</span><sup>0{index + 1}</sup></a></li>)}</ol>
          </div>
          <div className="colab-mobile-menu__socials"><TopLinks /></div>
        </nav>
      </div>}

      <section className="colab-hero">
        <h1>24 colab</h1>
        <div className="colab-about"><p className="colab-about-label">About the project</p><p>24COLAB: RESEARCH, CONTENT WRITING, AND EDITING FOR ENTERPRISES. ONE-OFF ORDERS OR DEDICATED TEAM SUBSCRIPTIONS.</p></div>
        <dl className="colab-meta">
          <div><dt>Project type</dt><dd>B2B Service Website</dd></div>
          <div><dt>Industry</dt><dd>Content Services</dd></div>
          <div><dt>Scope of work</dt><dd>UX/UI Web Design</dd></div>
          <div><dt>Website goal</dt><dd>Present Services Clearly</dd></div>
        </dl>
      </section>

      <section className="colab-content">
        <div className="colab-logo">
          <div className="colab-logo-pattern" role="img" aria-label="24 colab">
            <img className="colab-logo-strokes" src={logoBackgroundComponent} alt="" />
            <span className="colab-logo-mark" aria-hidden="true">
              <img className="colab-logo-vector-one" src={logoVectorOne} alt="" />
              <img className="colab-logo-vector" src={logoVector} alt="" />
              <img className="colab-logo-group" src={logoGroup} alt="" />
            </span>
          </div>
        </div>
        <section className="colab-copy-section colab-challenge">
          <p className="colab-section-label">The challenge</p>
          <div><h2>THE WEBSITE NEEDED TO CLEARLY COMMUNICATE 24COLAB’S VALUE PROPOSITION AND DIFFERENTIATE ITS TWO SERVICE MODELS: ONE-OFF PROJECT ORDERS AND ONGOING SUPPORT VIA A DEDICATED TEAM.</h2><p>We needed to build an intuitive UX/UI layout that showcases how the platform matches specialized talent, manages workflows, and ensures quality control.</p></div>
        </section>
        <section className="colab-screens" aria-label="24 colab website page previews"><div className="colab-screens-canvas"><div className="colab-screen colab-screen-managed"><img src={managedServices} alt="Managed services page" /></div><div className="colab-screen colab-screen-faq-bottom"><img src={faq} alt="FAQ page" /></div><div className="colab-screen colab-screen-faq-top"><img src={faq} alt="FAQ page" /></div><div className="colab-screen colab-screen-outsourcing"><img src={contentOutsourcing} alt="Content outsourcing page" /></div></div></section>
        <section className="colab-copy-section colab-solution">
          <p className="colab-section-label">The solution</p>
          <div><h2>THE SITE STRUCTURE GUIDES VISITORS FROM A CLEAR SERVICE OVERVIEW TO CHOOSING THE RIGHT ENGAGEMENT MODEL—WHETHER PLACING A SINGLE ORDER OR OUTSOURCING REGULAR CONTENT PRODUCTION.</h2><p>Visualizing talent selection, quality control, and order tracking showcases operational reliability, replacing generic promises with concrete design-driven proof.</p></div>
        </section>
        <section className="colab-features">
          <p className="colab-section-label">Key features</p>
          <div className="colab-feature-grid">
            {colabFeatures.slice(0, 2).map(([icons, title, description]) => <article key={title}><span className={`colab-feature-icon colab-feature-icon-${title.split(" ")[0].toLowerCase()}`}>{icons.map((icon) => <img key={icon} src={icon} alt="" />)}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}
            {colabFeatures.slice(2).map(([icons, title, description]) => <article key={title}><span className={`colab-feature-icon colab-feature-icon-${title.split(" ")[0].toLowerCase()}`}>{icons.map((icon) => <img key={icon} src={icon} alt="" />)}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}
          </div>
        </section>
        <section className="colab-next">
          <div className="colab-next-head"><h2>Next projects</h2></div>
          <div className="colab-next-content">
            <div className="colab-next-cards">
              <article className="colab-next-card">
                <p>Site/</p><div className="colab-next-image colab-next-image-dim"><img src={nextSmartBusinessIntelligence} alt="Smart Business Intelligence project" /></div>
                <div><span>Smart Business Intelligence</span><a href="https://smartbusinessintelligence.co.uk" target="_blank" rel="noreferrer"><HoverText>Live</HoverText></a></div>
              </article>
              <article className="colab-next-card">
                <p>Landing/</p><div className="colab-next-image"><img src={projectMedia.skyliner} alt="Skyliner project" /></div>
                <div><span>Skyliner</span><a href="https://skyliner.rv.ua/" target="_blank" rel="noreferrer"><HoverText>Live</HoverText></a></div>
              </article>
            </div>
            <p className="colab-next-note">Users always compare options.</p>
          </div>
        </section>
      </section>
      {footer}
    </main>
  );
}

export function CasePage({ project, footer }) {
  if (project.path === "/work/24colab-content-services-website") return <ColabCasePage footer={footer} />;
  const relatedProject = getProjectByPath(project.relatedPath);
  const nextProject = relatedProject ? getProjectByPath(relatedProject.relatedPath) : null;

  return (
    <main className="case-page" aria-label={`${project.name} project case study`}>
      <header className="case-header"><a href="/" className="case-back">← Project</a><TopLinks /></header>
      <section className="case-hero">
        <h1>{project.name}</h1>
        <div className="case-intro"><p>About the project</p><p>{project.overview}</p></div>
        <dl className="case-meta">{Object.entries(project.meta).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </section>
      <section className="case-body">
        <div className="case-image-wrap"><img src={projectMedia[project.image]} alt={project.imageAlt} /></div>
        <section className="case-two-col"><p>The challenge</p><div><h2>{project.challenge}</h2></div></section>
        <section className="case-preview"><img src={projectMedia[project.image]} alt="" /></section>
        <section className="case-two-col"><p>The solution</p><div><h2>{project.solution}</h2></div></section>
        <section className="case-features"><p>Key features</p><div>{project.features.map((feature, index) => <article key={feature}><span>0{index + 1}</span><h3>{feature}</h3></article>)}</div></section>
        <section className="case-next"><h2>Next projects</h2><div>{[relatedProject, nextProject].filter(Boolean).map((next) => <a href={next.path} key={next.path}><img src={projectMedia[next.image]} alt={next.imageAlt} /><span>{next.name}</span></a>)}</div></section>
      </section>
      <section className="case-contact"><a className="case-live" href={project.liveUrl} target="_blank" rel="noreferrer"><HoverText>View live project</HoverText></a></section>
      {footer}
    </main>
  );
}
