import React from "react";
import { TopLinks } from "../components/TopLinks.jsx";
import { HoverText } from "../components/PortfolioPrimitives.jsx";
import { projectMedia } from "../content/projectMedia.js";
import { getProjectByPath } from "../content/projects.js";
import "./CasePage.css";

export function CasePage({ project, footer }) {
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
