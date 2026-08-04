import React from "react";
import { briefHref } from "./PortfolioPrimitives.jsx";
import "./TopLinks.css";

const topLinks = [
  { id: "linkedin", label: "Linkedin", href: "https://www.linkedin.com/in/annloban/" },
  { id: "dribbble", label: "Dribbble", href: "https://dribbble.com/azzaza" },
  { id: "telegram", label: "telegram", href: "https://t.me/anna_loban" },
  { id: "mail", label: "mail", href: briefHref, external: false },
];

export function TopLinks() {
  return (
    <nav className="top-links relative z-40 flex w-full flex-wrap items-start justify-between gap-x-6 gap-y-2 font-jakarta text-base uppercase leading-[25px] text-white lg:justify-end lg:gap-[40px]">
      {topLinks.map((link) => (
        <a
          data-gl-text
          data-gl-hero-text
          data-nav-link={link.id}
          href={link.href}
          target={link.external === false ? undefined : "_blank"}
          rel={link.external === false ? undefined : "noreferrer"}
          className="underline"
          key={link.id}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
