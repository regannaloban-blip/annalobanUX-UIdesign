import React from "react";
import { HoverText } from "./PortfolioPrimitives.jsx";
import projectCardHoverArrow from "../assets/figma/24colab/project-card-hover-ring.svg";
import projectCardHoverCircle from "../assets/figma/24colab/project-card-hover-arrow.svg";

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
  showCaseHover = false,
}) {
  const media = renderMedia();

  return (
    <article {...(slide ? { "data-project-slide": true } : {})} className={`project-card project-card--${theme} ${className}`}>
      <p className={`project-card__kind ${kindClassName}`}>{kind}</p>
      {caseHref ? <a className={`${mediaClassName}${showCaseHover ? " project-card__case-link" : ""}`} data-hover-text-trigger href={caseHref}>{media}{showCaseHover && <span className="project-card__case-hover" aria-hidden="true"><img src={projectCardHoverCircle} alt="" /><img src={projectCardHoverArrow} alt="" /></span>}</a> : media}
      <div className={`project-card__footer ${footerClassName}`}>
        {caseHref ? <a className="project-card__title" data-hover-text-trigger href={caseHref}><HoverText triggerOnParent>{name}</HoverText></a> : <span className="project-card__title">{name}</span>}
        <a href={liveUrl} target="_blank" rel="noreferrer" className="project-card__live"><HoverText>Live</HoverText></a>
      </div>
    </article>
  );
}
