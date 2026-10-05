import React, { useEffect, useRef, useState } from "react";
import { TopLinks } from "../components/TopLinks.jsx";
import { HoverText } from "../components/PortfolioPrimitives.jsx";
import { ProjectCard } from "../components/ProjectCard.jsx";
import { CaseVisitSite } from "../components/CaseVisitSite.jsx";
import { projectMedia } from "../content/projectMedia.js";
import { projects } from "../content/projects.js";
import mobileMenuBackIcon from "../assets/figma/24colab/menu-back.svg";
import colabLogo from "../assets/figma/24colab/logo-pattern.png";
import colabLogoStrokes from "../assets/figma/24colab/logo-strokes.svg";
import colabLogoVector from "../assets/figma/24colab/logo-vector.svg";
import colabLogoVectorOne from "../assets/figma/24colab/logo-vector-1.svg";
import colabLogoGroup from "../assets/figma/24colab/logo-group.svg";
import colabScreens from "../assets/figma/24colab/screens.png";
import featureCohesive from "../assets/figma/24colab/feature-cohesive.svg";
import featureDual from "../assets/figma/24colab/feature-dual.svg";
import featureTransparent from "../assets/figma/24colab/feature-transparent.svg";
import featureScalable from "../assets/figma/24colab/feature-scalable.svg";
import smartBusinessLogo from "../assets/figma/smart-business-intelligence/logo-block.png";
import smartBusinessScreens from "../assets/figma/smart-business-intelligence/screen-mosaic.png";
import smartBusinessFeatureConversionFunnel from "../assets/figma/smart-business-intelligence/feature-conversion-funnel.svg";
import smartBusinessFeatureServiceMapping from "../assets/figma/smart-business-intelligence/feature-service-mapping.svg";
import smartBusinessFeatureComponentArchitecture from "../assets/figma/smart-business-intelligence/feature-component-architecture.svg";
import smartBusinessFeatureDataVisualSystem from "../assets/figma/smart-business-intelligence/feature-data-visual-system.svg";
import skylinerScreens from "../assets/figma/skyliner/screen-mosaic.png";
import skylinerFeatureLeasingFunnel from "../assets/figma/skyliner/feature-leasing-funnel.svg";
import skylinerFeatureSpaceNavigation from "../assets/figma/skyliner/feature-space-navigation.svg";
import skylinerFeatureComponentSystem from "../assets/figma/skyliner/feature-component-system.svg";
import skylinerFeatureB2bRedesign from "../assets/figma/skyliner/feature-b2b-redesign.svg";
import yourDissertationLogo from "../assets/figma/your-dissertation/logo-block.png";
import yourDissertationScreens from "../assets/figma/your-dissertation/screen-mosaic.png";
import yourDissertationCalculator from "../assets/figma/your-dissertation/feature-calculator.svg";
import yourDissertationCheckoutFlow from "../assets/figma/your-dissertation/feature-checkout-flow.svg";
import yourDissertationServiceArchitecture from "../assets/figma/your-dissertation/feature-service-architecture.svg";
import yourDissertationTrustIdentity from "../assets/figma/your-dissertation/feature-trust-identity.svg";
import "./CasePage.css";

const caseAssets = {
  "24colab-logo": colabLogo,
  "24colab-screens": colabScreens,
  "smart-business-logo": smartBusinessLogo,
  "smart-business-screens": smartBusinessScreens,
  "skyliner-screens": skylinerScreens,
  "your-dissertation-logo": yourDissertationLogo,
  "your-dissertation-screens": yourDissertationScreens,
};

const featureIcons = {
  cohesive: featureCohesive,
  dual: featureDual,
  transparent: featureTransparent,
  scalable: featureScalable,
  "sbi-conversion": smartBusinessFeatureConversionFunnel,
  "sbi-mapping": smartBusinessFeatureServiceMapping,
  "sbi-architecture": smartBusinessFeatureComponentArchitecture,
  "sbi-visual-system": smartBusinessFeatureDataVisualSystem,
  "skyliner-leasing": skylinerFeatureLeasingFunnel,
  "skyliner-navigation": skylinerFeatureSpaceNavigation,
  "skyliner-system": skylinerFeatureComponentSystem,
  "skyliner-redesign": skylinerFeatureB2bRedesign,
  "yd-calculator": yourDissertationCalculator,
  "yd-checkout": yourDissertationCheckoutFlow,
  "yd-architecture": yourDissertationServiceArchitecture,
  "yd-trust": yourDissertationTrustIdentity,
};

const colabMobileMenuItems = [
  ["Work", "/#works"],
  ["Services", "/#about"],
  ["Contact", "/#contact-form"],
];

const projectKinds = {
  "24colab": "Website/",
  "smart-business-intelligence": "Website/",
  skyliner: "Landing/",
  "your-dissertation": "Website/",
};

function getNextProjects(currentPath) {
  const currentIndex = projects.findIndex((project) => project.path === currentPath);
  if (currentIndex < 0) return projects;
  return [...projects.slice(currentIndex + 1), ...projects.slice(0, currentIndex + 1)];
}

function NextProjectCard({ next }) {
  return (
    <ProjectCard
      slide
      theme="light"
      kind={projectKinds[next.image]}
      name={next.name}
      caseHref={next.path}
      liveUrl={next.liveUrl}
      className="colab-next-card"
      mediaClassName="colab-next-case-link"
      footerClassName="colab-next-footer"
      showCaseHover
      renderMedia={() => <span className="colab-next-image"><img className="colab-next-image__background" src={projectMedia[next.image]} alt="" aria-hidden="true" loading="lazy" decoding="async" /><img className="colab-next-image__foreground" src={projectMedia[next.image]} alt={next.imageAlt} loading="lazy" decoding="async" /></span>}
    />
  );
}

function useProjectSlider() {
  const sliderRef = useRef(null);

  useEffect(() => {
    const carousel = sliderRef.current;
    if (!carousel) return undefined;

    carousel.scrollLeft = 0;
    let pointerId = null;
    let startX = 0;
    let startScrollLeft = 0;
    let resizeFrame = 0;
    const isCarousel = () => carousel.scrollWidth > carousel.clientWidth;
    const clampScroll = (value) => Math.min(carousel.scrollWidth - carousel.clientWidth, Math.max(0, value));
    const finishDrag = (event) => {
      if (event.pointerId !== pointerId) return;
      if (carousel.hasPointerCapture(pointerId)) carousel.releasePointerCapture(pointerId);
      pointerId = null;
      carousel.classList.remove("is-dragging");
    };
    const startDrag = (event) => {
      if (!isCarousel() || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
      if (event.target.closest("a, button, input, textarea, select")) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = carousel.scrollLeft;
      carousel.setPointerCapture(pointerId);
    };
    const drag = (event) => {
      if (event.pointerId !== pointerId) return;
      const distance = event.clientX - startX;
      if (Math.abs(distance) <= 4) return;
      carousel.classList.add("is-dragging");
      event.preventDefault();
      carousel.scrollLeft = clampScroll(startScrollLeft - distance);
    };
    const resetAfterResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => { carousel.scrollLeft = 0; });
    };

    carousel.addEventListener("pointerdown", startDrag);
    carousel.addEventListener("pointermove", drag);
    carousel.addEventListener("pointerup", finishDrag);
    carousel.addEventListener("pointercancel", finishDrag);
    window.addEventListener("resize", resetAfterResize);
    return () => {
      carousel.removeEventListener("pointerdown", startDrag);
      carousel.removeEventListener("pointermove", drag);
      carousel.removeEventListener("pointerup", finishDrag);
      carousel.removeEventListener("pointercancel", finishDrag);
      window.removeEventListener("resize", resetAfterResize);
      window.cancelAnimationFrame(resizeFrame);
    };
  }, []);

  return sliderRef;
}

function CaseTemplateHeader() {
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
    const closeOnEscape = (event) => { if (event.key === "Escape") setIsMobileMenuOpen(false); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMobileMenuOpen]);

  return <>
    <header className="colab-topbar">
      <a href="/" className="colab-back"><img src={mobileMenuBackIcon} alt="" /><span className="colab-back__desktop"><HoverText>Project</HoverText></span><span className="colab-back__mobile"><HoverText>Anna Loban</HoverText></span></a>
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
        <div className="colab-mobile-menu__content"><p>Turn complex ideas into<br />clear digital systems.</p><ol>{colabMobileMenuItems.map(([label, href], index) => <li key={label}><a href={href} onClick={() => setIsMobileMenuOpen(false)}><span>{label}</span><sup>0{index + 1}</sup></a></li>)}</ol></div>
        <div className="colab-mobile-menu__socials"><TopLinks /></div>
      </nav>
    </div>}
  </>;
}

function ColabLogoBlock() {
  return <div className="colab-logo">
    <div className="colab-logo-pattern">
      <img className="colab-logo-strokes" src={colabLogoStrokes} alt="" />
      <span className="colab-logo-mark" aria-label="24 Colab">
        <img className="colab-logo-vector" src={colabLogoVector} alt="" />
        <img className="colab-logo-vector-one" src={colabLogoVectorOne} alt="" />
        <img className="colab-logo-group" src={colabLogoGroup} alt="" />
      </span>
    </div>
  </div>;
}

function CaseTemplate({ project, footer }) {
  const nextProjectsRef = useProjectSlider();
  const visualKey = project.caseAssets.visual;
  const visual = visualKey ? caseAssets[visualKey] : null;
  const screens = caseAssets[project.caseAssets.screens];

  return <>
    <main className="case-page colab-case" aria-label={`${project.name} project case study`}>
      <CaseTemplateHeader />
      <section className="colab-hero">
        {project.heroTitle ? (
          <div className="colab-hero-title colab-hero-title--split">
            <h1>{project.heroTitle.primary}</h1>
            <p>{project.heroTitle.secondary}</p>
          </div>
        ) : <h1>{project.name}</h1>}
        <div className="colab-about"><p className="colab-about-label">About the project</p><p>{project.overview}</p></div>
        <dl className="colab-meta">{Object.entries(project.meta).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </section>
      <section className="colab-content">
        {visualKey === "24colab-logo" ? <ColabLogoBlock /> : visual && <div className={`colab-logo colab-logo--${visualKey}`}><img className="case-template-logo" src={visual} alt="" /></div>}
        <section className="colab-copy-section colab-challenge"><p className="colab-section-label">The challenge</p><div><h2>{project.challenge}</h2>{project.challengeDetail && <p>{project.challengeDetail}</p>}</div></section>
        <section className="colab-screens case-template-screens" aria-label={`${project.name} website page previews`}><img src={screens} alt={`${project.name} website page previews`} loading="lazy" decoding="async" /></section>
        <section className="colab-copy-section colab-solution"><p className="colab-section-label">The solution</p><div><h2>{project.solution}</h2>{project.solutionDetail && <p>{project.solutionDetail}</p>}</div></section>
        <section className="colab-features"><p className="colab-section-label">Key features</p><div className="colab-feature-grid">{project.features.map((feature) => <article key={feature.title}><span className="case-template-feature-icon"><img src={featureIcons[feature.icon]} alt="" /></span><div><h3>{feature.title}</h3>{feature.description && <p>{feature.description}</p>}</div></article>)}</div></section>
        <section className="colab-next"><div className="colab-next-head"><h2>Next projects</h2></div><div ref={nextProjectsRef} className="colab-next-content"><div className="colab-next-cards">{getNextProjects(project.path).map((next) => <NextProjectCard key={next.path} next={next} />)}</div></div></section>
      </section>
      {footer}
    </main>
    <CaseVisitSite href={project.liveUrl} />
  </>;
}

export function CasePage({ project, footer }) {
  return <CaseTemplate project={project} footer={footer} />;
}
