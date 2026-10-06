import React, { useEffect, useState } from "react";
import { HoverText } from "./PortfolioPrimitives.jsx";
import visitSiteBackground from "../assets/figma/visit-site/favicon.png";
import visitSiteMark from "../assets/figma/visit-site/anna-mark.svg";

export function CaseVisitSite({ href }) {
  const [canScrollToTop, setCanScrollToTop] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setCanScrollToTop(window.scrollY >= window.innerHeight * 2);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

  return (
    <aside className="case-visit-site" aria-label="Project links">
      <a className="case-visit-site__home" href="/" aria-label="Back to home page">
      <span className="case-visit-site__preview" aria-hidden="true">
        <img className="case-visit-site__background" src={visitSiteBackground} alt="" />
        <span className="case-visit-site__shade" />
        <img className="case-visit-site__mark" src={visitSiteMark} alt="" />
      </span>
      </a>
      <button className="case-visit-site__arrow" type="button" onClick={scrollToTop} disabled={!canScrollToTop} aria-label="Scroll to top"><svg className="case-visit-site__arrow-icon" aria-hidden="true" viewBox="0 0 16.5054 16" fill="none"><path d="M16.5054 8.39609H1.30538" /><path d="M6.50538 3.30883 1.41421 8.4l5.09117 5.0912" /></svg></button>
      <a className="case-visit-site__live" data-hover-text-trigger href={href} target="_blank" rel="noreferrer"><HoverText triggerOnParent>Visit site</HoverText></a>
    </aside>
  );
}
