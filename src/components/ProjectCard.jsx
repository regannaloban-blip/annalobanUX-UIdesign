import React from "react";
import { HoverText, NavigationButton } from "./PortfolioPrimitives.jsx";

export function ProjectCard({
  kind,
  name,
  liveUrl,
  caseHref,
  renderMedia,
  className = "",
  kindClassName = "",
  mediaClassName = "",
  footerClassName = "",
  theme = "dark",
  slide = false,
  mobileSwipeHint = false,
  hoverEffects = true,
}) {
  const media = renderMedia();
  const hoverTrigger = hoverEffects ? { "data-hover-text-trigger": true } : {};

  return (
    <article {...(slide ? { "data-project-slide": true } : {})} className={`project-card project-card--${theme} ${className}`}>
      {mobileSwipeHint ? (
        <div className="project-card__meta">
          <p className={`project-card__kind ${kindClassName}`}>{kind}</p>
          <span className="project-card__swipe-hint" aria-hidden="true">Swipe me</span>
        </div>
      ) : <p className={`project-card__kind ${kindClassName}`}>{kind}</p>}
      {caseHref ? <NavigationButton className={mediaClassName} {...hoverTrigger} href={caseHref}>{media}</NavigationButton> : media}
      <div className={`project-card__footer ${footerClassName}`}>
        {caseHref ? <NavigationButton className="project-card__title" {...hoverTrigger} href={caseHref}>{hoverEffects ? <HoverText triggerOnParent>{name}</HoverText> : name}</NavigationButton> : <span className="project-card__title">{name}</span>}
        <NavigationButton href={liveUrl} newTab className="project-card__live">{hoverEffects ? <HoverText>Live</HoverText> : "Live"}</NavigationButton>
      </div>
    </article>
  );
}
