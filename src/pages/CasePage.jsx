import React, { useCallback, useEffect, useRef, useState } from "react";
import { TopLinks } from "../components/TopLinks.jsx";
import { HoverText, navigateToHomeSection, NavigationButton } from "../components/PortfolioPrimitives.jsx";
import { ProjectCard } from "../components/ProjectCard.jsx";
import { FluidImageHover } from "../components/FluidImageHover.jsx";
import { CaseVisitSite } from "../components/CaseVisitSite.jsx";
import { projectMedia } from "../content/projectMedia.js";
import { projects } from "../content/projects.js";
import mobileMenuBackIcon from "../assets/figma/24colab/menu-back.svg";
import telegramHeaderIcon from "../assets/figma/telegram-header.svg";
import colabLogoStrokes from "../assets/figma/24colab/logo-strokes.svg";
import colabLogoMobile from "../assets/figma/24colab/variants/logo-mobile.svg";
import colabLogoTablet from "../assets/figma/24colab/variants/logo-tablet.svg";
import colabLogoDesktop from "../assets/figma/24colab/variants/logo-desktop.svg";
import colabScreens from "../assets/figma/project-screens/24colab.webp";
import featureCohesive from "../assets/figma/24colab/feature-cohesive.svg";
import featureDual from "../assets/figma/24colab/feature-dual.svg";
import featureTransparent from "../assets/figma/24colab/feature-transparent.svg";
import featureScalable from "../assets/figma/24colab/feature-scalable.svg";
import smartBusinessLogoMobile from "../assets/figma/smart-business-intelligence/variants/logo-mobile.svg";
import smartBusinessLogoTablet from "../assets/figma/smart-business-intelligence/variants/logo-tablet.svg";
import smartBusinessLogoDesktop from "../assets/figma/smart-business-intelligence/variants/logo-desktop.svg";
import smartBusinessScreens from "../assets/figma/project-screens/smart-business-intelligence.webp";
import smartBusinessFeatureConversionFunnel from "../assets/figma/smart-business-intelligence/feature-conversion-funnel.svg";
import smartBusinessFeatureServiceMapping from "../assets/figma/smart-business-intelligence/feature-service-mapping.svg";
import smartBusinessFeatureComponentArchitecture from "../assets/figma/smart-business-intelligence/feature-component-architecture.svg";
import smartBusinessFeatureDataVisualSystem from "../assets/figma/smart-business-intelligence/feature-data-visual-system.svg";
import skylinerScreens from "../assets/figma/project-screens/skyliner.webp";
import skylinerFeatureLeasingFunnel from "../assets/figma/skyliner/feature-leasing-funnel.svg";
import skylinerFeatureSpaceNavigation from "../assets/figma/skyliner/feature-space-navigation.svg";
import skylinerFeatureComponentSystem from "../assets/figma/skyliner/feature-component-system.svg";
import skylinerFeatureB2bRedesign from "../assets/figma/skyliner/feature-b2b-redesign.svg";
import yourDissertationLogoMobile from "../assets/figma/your-dissertation/variants/logo-mobile.svg";
import yourDissertationLogoTablet from "../assets/figma/your-dissertation/variants/logo-tablet.svg";
import yourDissertationLogoDesktop from "../assets/figma/your-dissertation/variants/logo-desktop.svg";
import yourDissertationScreens from "../assets/figma/project-screens/your-dissertation.webp";
import yourDissertationCalculator from "../assets/figma/your-dissertation/feature-calculator.svg";
import yourDissertationCheckoutFlow from "../assets/figma/your-dissertation/feature-checkout-flow.svg";
import yourDissertationServiceArchitecture from "../assets/figma/your-dissertation/feature-service-architecture.svg";
import yourDissertationTrustIdentity from "../assets/figma/your-dissertation/feature-trust-identity.svg";
import "./CasePage.css";

const caseAssets = {
  "24colab-logo": { mobile: colabLogoMobile, tablet: colabLogoTablet, desktop: colabLogoDesktop },
  "24colab-screens": colabScreens,
  "smart-business-logo": { mobile: smartBusinessLogoMobile, tablet: smartBusinessLogoTablet, desktop: smartBusinessLogoDesktop },
  "smart-business-screens": smartBusinessScreens,
  "skyliner-screens": skylinerScreens,
  "your-dissertation-logo": { mobile: yourDissertationLogoMobile, tablet: yourDissertationLogoTablet, desktop: yourDissertationLogoDesktop },
  "your-dissertation-screens": yourDissertationScreens,
};

const caseScreenDimensions = {
  "24colab-screens": { width: 2378, height: 1194 },
  "smart-business-screens": { width: 3018, height: 1866 },
  "skyliner-screens": { width: 2378, height: 1194 },
  "your-dissertation-screens": { width: 2378, height: 1194 },
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
  ["ABOUT", "#about"],
  ["SOLUTIONS", "#solutions"],
  ["PROJECTS", "#works"],
  ["CONTACT", "#contact-form"],
];

const projectKinds = {
  "24colab": "Website/",
  "smart-business-intelligence": "Website/",
  skyliner: "Landing/",
  "your-dissertation": "Website/",
};

const swipeHintStorageKey = "portfolio-next-projects-swipe-hint-seen";

function getNextProjects(currentPath) {
  const currentIndex = projects.findIndex((project) => project.path === currentPath);
  if (currentIndex < 0) return projects;
  return [...projects.slice(currentIndex + 1), ...projects.slice(0, currentIndex + 1)];
}

function NextProjectCard({ next, showSwipeHint, hoverEffects }) {
  return (
    <ProjectCard
      slide
      mobileSwipeHint={showSwipeHint}
      hoverEffects={hoverEffects}
      theme="light"
      kind={projectKinds[next.image]}
      name={next.name}
      caseHref={next.path}
      liveUrl={next.liveUrl}
      className="colab-next-card"
      mediaClassName="colab-next-case-link"
      footerClassName="colab-next-footer"
      renderMedia={() => <span className="colab-next-image"><FluidImageHover src={projectMedia[next.image]} alt={next.imageAlt} desktopOnly enabled={hoverEffects} /></span>}
    />
  );
}

function useProjectSlider(onSwipe) {
  const sliderRef = useRef(null);

  useEffect(() => {
    const carousel = sliderRef.current;
    if (!carousel) return undefined;

    carousel.scrollLeft = 0;
    let pointerId = null;
    let startX = 0;
    let startScrollLeft = 0;
    let resizeFrame = 0;
    let dragFrame = 0;
    let targetScrollLeft = 0;
    let releaseWhenSettled = false;
    let suppressNextClick = false;
    let didDrag = false;
    let hasSwiped = false;
    const isCarousel = () => carousel.scrollWidth > carousel.clientWidth;
    const isDesktopCarousel = () => window.matchMedia("(min-width: 1021px) and (hover: hover) and (pointer: fine)").matches;
    const markSwipe = () => {
      if (hasSwiped || !window.matchMedia("(max-width: 600px)").matches) return;
      hasSwiped = true;
      onSwipe();
    };
    const clampScroll = (value) => Math.min(carousel.scrollWidth - carousel.clientWidth, Math.max(0, value));
    const finishDesktopScroll = () => {
      carousel.classList.remove("is-dragging");
      releaseWhenSettled = false;
    };
    const renderDesktopScroll = () => {
      const distance = targetScrollLeft - carousel.scrollLeft;
      if (Math.abs(distance) < 0.5) {
        carousel.scrollLeft = targetScrollLeft;
        dragFrame = 0;
        if (releaseWhenSettled) finishDesktopScroll();
        return;
      }

      carousel.scrollLeft += distance * 0.26;
      dragFrame = window.requestAnimationFrame(renderDesktopScroll);
    };
    const setDesktopScrollTarget = (value) => {
      targetScrollLeft = clampScroll(value);
      if (!dragFrame) dragFrame = window.requestAnimationFrame(renderDesktopScroll);
    };
    const finishDrag = (event) => {
      if (pointerId === null || (event.pointerId != null && event.pointerId !== pointerId)) return;
      if (carousel.hasPointerCapture(pointerId)) carousel.releasePointerCapture(pointerId);
      if (didDrag) {
        suppressNextClick = true;
        window.setTimeout(() => { suppressNextClick = false; }, 0);
      }
      pointerId = null;
      if (isDesktopCarousel() && dragFrame) releaseWhenSettled = true;
      else carousel.classList.remove("is-dragging");
    };
    const startDrag = (event) => {
      if (!isCarousel() || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
      // A short press follows the card link; movement is handled as drag below.
      if (event.target.closest("input, textarea, select")) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = carousel.scrollLeft;
      targetScrollLeft = carousel.scrollLeft;
      didDrag = false;
    };
    const drag = (event) => {
      if (event.pointerId !== pointerId) return;
      const distance = event.clientX - startX;
      if (Math.abs(distance) <= 4) return;
      if (!didDrag) {
        didDrag = true;
        carousel.setPointerCapture(pointerId);
        carousel.classList.add("is-dragging");
      }
      markSwipe();
      event.preventDefault();
      if (isDesktopCarousel()) setDesktopScrollTarget(startScrollLeft - distance);
      else carousel.scrollLeft = clampScroll(startScrollLeft - distance);
    };
    const preventFollowAfterDrag = (event) => {
      if (!suppressNextClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressNextClick = false;
    };
    const resetAfterResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => { carousel.scrollLeft = 0; });
    };
    const handleScroll = () => {
      if (carousel.scrollLeft > 4) markSwipe();
    };

    carousel.addEventListener("pointerdown", startDrag);
    carousel.addEventListener("pointermove", drag);
    carousel.addEventListener("pointerup", finishDrag);
    carousel.addEventListener("pointercancel", finishDrag);
    carousel.addEventListener("lostpointercapture", finishDrag);
    carousel.addEventListener("click", preventFollowAfterDrag, true);
    carousel.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mouseup", finishDrag);
    window.addEventListener("resize", resetAfterResize);
    return () => {
      carousel.removeEventListener("pointerdown", startDrag);
      carousel.removeEventListener("pointermove", drag);
      carousel.removeEventListener("pointerup", finishDrag);
      carousel.removeEventListener("pointercancel", finishDrag);
      carousel.removeEventListener("lostpointercapture", finishDrag);
      carousel.removeEventListener("click", preventFollowAfterDrag, true);
      carousel.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mouseup", finishDrag);
      window.removeEventListener("resize", resetAfterResize);
      window.cancelAnimationFrame(resizeFrame);
      window.cancelAnimationFrame(dragFrame);
    };
  }, [onSwipe]);

  return sliderRef;
}

function useDesktopCardHover() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1021px) and (hover: hover) and (pointer: fine)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return enabled;
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
      <NavigationButton href="/" className="colab-back"><img src={mobileMenuBackIcon} alt="" /><span className="colab-back__desktop"><HoverText>HOME</HoverText></span><span className="colab-back__mobile"><HoverText>HOME</HoverText></span></NavigationButton>
      <nav className="colab-case-nav" aria-label="Case page navigation">{colabMobileMenuItems.map(([label, hash]) => <NavigationButton key={label} href={`/${hash}`} onClick={(event) => navigateToHomeSection(event, hash)}><HoverText>{label}</HoverText></NavigationButton>)}<NavigationButton href="https://t.me/anna_loban" newTab aria-label="Telegram" className="colab-case-nav__telegram"><img src={telegramHeaderIcon} alt="" /></NavigationButton></nav>
      <button type="button" className="colab-menu-toggle" aria-expanded={isMobileMenuOpen || isMobileMenuOpening} aria-controls="colab-mobile-menu" aria-label="Open menu" disabled={isMobileMenuOpening} onClick={openMobileMenu}>
        <span className={`colab-menu-toggle__icon${isMobileMenuOpening ? " colab-menu-toggle__icon--opening" : ""}`} aria-hidden="true"><span /><span /><span /></span>
      </button>
    </header>
    {isMobileMenuOpen && <div className="colab-mobile-menu" role="presentation" onClick={() => setIsMobileMenuOpen(false)}>
      <nav id="colab-mobile-menu" className="colab-mobile-menu__panel" aria-label="Mobile menu" onClick={(event) => event.stopPropagation()}>
        <div className="colab-mobile-menu__header">
          <NavigationButton href="/" className="colab-mobile-menu__brand"><img src={mobileMenuBackIcon} alt="" /><span>Anna Loban</span></NavigationButton>
          <button type="button" className="colab-mobile-menu__toggle" aria-label="Close menu" onClick={() => setIsMobileMenuOpen(false)}><span className="colab-menu-toggle__icon colab-menu-toggle__icon--active" aria-hidden="true"><span /></span></button>
        </div>
        <div className="colab-mobile-menu__content"><p>Connect everything once,<br />Then automate forever.</p><ol>{colabMobileMenuItems.map(([label, hash], index) => <li key={label}><NavigationButton href={`/${hash}`} onClick={(event) => { setIsMobileMenuOpen(false); navigateToHomeSection(event, hash); }}><span>{label}</span><sup>0{index + 1}</sup></NavigationButton></li>)}</ol></div>
        <div className="colab-mobile-menu__socials"><TopLinks mobileMenu /></div>
      </nav>
    </div>}
  </>;
}

function ResponsiveLogo({ variants }) {
  return <picture className="case-template-logo-picture">
    <source media="(min-width: 1040px)" srcSet={variants.desktop} />
    <source media="(min-width: 601px)" srcSet={variants.tablet} />
    <img className="case-template-logo" src={variants.mobile} alt="" />
  </picture>;
}

function ColabLogoBlock() {
  return <div className="colab-logo">
    <div className="colab-logo-pattern">
      <img className="colab-logo-strokes" src={colabLogoStrokes} alt="" />
      <span className="colab-logo-mark" aria-label="24 Colab">
        <ResponsiveLogo variants={caseAssets["24colab-logo"]} />
      </span>
    </div>
  </div>;
}

function CaseTemplate({ project, footer }) {
  const [hasSeenSwipeHint, setHasSeenSwipeHint] = useState(() => {
    try {
      return window.localStorage.getItem(swipeHintStorageKey) === "true";
    } catch {
      return false;
    }
  });
  const desktopCardHover = useDesktopCardHover();
  const markSwipeHintSeen = useCallback(() => {
    setHasSeenSwipeHint(true);
    try {
      window.localStorage.setItem(swipeHintStorageKey, "true");
    } catch {
      // The hint still disappears for this visit when storage is unavailable.
    }
  }, []);
  const nextProjectsRef = useProjectSlider(markSwipeHintSeen);
  const visualKey = project.caseAssets.visual;
  const visual = visualKey ? caseAssets[visualKey] : null;
  const screenKey = project.caseAssets.screens;
  const screens = caseAssets[screenKey];
  const screenDimensions = caseScreenDimensions[screenKey];

  return <>
    <main className="case-page colab-case" aria-label={`${project.name} project case study`}>
      <CaseTemplateHeader />
      <section className="colab-hero">
        {project.heroTitle ? (
          <div className="colab-hero-title colab-hero-title--split">
            <h1>{project.heroTitle.primary}</h1>
            <p>{project.heroTitle.secondary}</p>
          </div>
        ) : project.path === "/work/your-dissertation-order-flow" ? (
          <h1 className="colab-hero-title--your-dissertation"><span>Your</span><span>Dissertation</span></h1>
        ) : <h1>{project.name}</h1>}
        <div className="colab-about"><p className="colab-about-label">About the project</p><p>{project.overview}</p></div>
        <dl className="colab-meta">{Object.entries(project.meta).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </section>
      <section className="colab-content">
        {visualKey === "24colab-logo" ? <ColabLogoBlock /> : visual && <div className={`colab-logo colab-logo--${visualKey}`}><div className="case-template-logo-frame"><ResponsiveLogo variants={visual} /></div></div>}
        <section className="colab-copy-section colab-challenge"><p className="colab-section-label">The challenge</p><div><h2>{project.challenge}</h2>{project.challengeDetail && <p>{project.challengeDetail}</p>}</div></section>
        <section className="colab-screens case-template-screens" aria-label={`${project.name} website page previews`}><img src={screens} width={screenDimensions.width} height={screenDimensions.height} alt={`${project.name} website page previews`} loading="lazy" decoding="async" /></section>
        <section className="colab-copy-section colab-solution"><p className="colab-section-label">The solution</p><div><h2>{project.solution}</h2>{project.solutionDetail && <p>{project.solutionDetail}</p>}</div></section>
        <section className="colab-features"><p className="colab-section-label">Key features</p><div className="colab-feature-grid">{project.features.map((feature) => <article key={feature.title}><span className="case-template-feature-icon"><img src={featureIcons[feature.icon]} alt="" /></span><div><h3>{feature.title}</h3>{feature.description && <p>{feature.description}</p>}</div></article>)}</div></section>
        <section className="colab-next"><div className="colab-next-head"><h2>Next projects</h2></div><div ref={nextProjectsRef} className="colab-next-content"><div className="colab-next-cards">{getNextProjects(project.path).map((next, index) => <NextProjectCard key={next.path} next={next} showSwipeHint={index === 0 && !hasSeenSwipeHint} hoverEffects={desktopCardHover} />)}</div></div></section>
      </section>
      {footer}
    </main>
    <CaseVisitSite href={project.liveUrl} />
  </>;
}

export function CasePage({ project, footer }) {
  return <CaseTemplate project={project} footer={footer} />;
}
