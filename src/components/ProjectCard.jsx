import React from "react";
import { HoverText } from "./PortfolioPrimitives.jsx";

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
}) {
  const media = renderMedia();

  return (
    <article {...(slide ? { "data-project-slide": true } : {})} className={`project-card project-card--${theme} ${className}`}>
      <p className={`project-card__kind ${kindClassName}`}>{kind}</p>
      {caseHref ? <a className={mediaClassName} data-hover-text-trigger href={caseHref}>{media}</a> : media}
      <div className={`project-card__footer ${footerClassName}`}>
        {caseHref ? <a className="project-card__title" data-hover-text-trigger href={caseHref}><HoverText triggerOnParent>{name}</HoverText></a> : <span className="project-card__title">{name}</span>}
        <a href={liveUrl} target="_blank" rel="noreferrer" className="project-card__live"><HoverText>Live</HoverText></a>
      </div>
    </article>
  );
}
