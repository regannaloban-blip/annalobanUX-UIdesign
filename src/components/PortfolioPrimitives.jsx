import React from "react";

const contactEmail = "hello.anna.loban@proton.me";
export const briefHref = `mailto:${contactEmail}?subject=Website%20or%20visual%20system%20brief`;
export const contactFormId = "contact-form";

function scrollToContactForm(event) {
  const form = document.getElementById(contactFormId);

  if (!form) return;

  event.preventDefault();

  const targetY = form.getBoundingClientRect().top + window.scrollY - (window.innerHeight - form.offsetHeight) / 2;
  const startY = window.scrollY;
  const distance = targetY - startY;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, targetY);
    return;
  }

  const duration = window.matchMedia("(min-width: 1024px)").matches ? 1800 : 1200;
  const start = performance.now();
  const easeInOutCubic = (value) => (value < 0.5 ? 4 * value * value * value : 1 - ((-2 * value + 2) ** 3) / 2);

  const animate = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));

    if (progress < 1) window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(animate);
}

export function Button({ className = "", webglHero = false, noFluid = false }) {
  return (
    <a
      {...(webglHero ? { "data-gl-hero-background": true } : {})}
      href={briefHref}
      onClick={scrollToContactForm}
      className={`inline-flex h-12 w-fit items-center justify-center border-b border-black bg-white px-10 text-black ${className}`}
    >
      <span
        data-gl-text
        data-gl-text-no-fluid={!webglHero || noFluid ? true : undefined}
        {...(webglHero ? { "data-gl-hero-text": true } : {})}
        data-color="black"
        className="block whitespace-nowrap font-jakarta text-base font-bold uppercase leading-[25px]"
      >
        start a project
      </span>
    </a>
  );
}

export function Display({ as: Tag = "h2", children, className = "", buffon = false, webglHero = false }) {
  const fontClass = buffon ? "font-buffon font-normal" : "font-display font-light";
  const sizeClass = buffon
    ? "text-[84px] leading-[85px] md:text-[118px] md:leading-[110px] lg:text-[175px] lg:leading-[160px]"
    : "text-[78px] leading-[84px] tracking-[-3.12px] md:text-[96px] md:leading-[94px] lg:text-[168px] lg:leading-[154px] lg:tracking-[-7px]";

  return (
    <Tag
      {...(webglHero ? { "data-gl-text": true, "data-gl-hero-text": true } : {})}
      className={`${fontClass} ${sizeClass} whitespace-nowrap uppercase tracking-normal text-white ${className}`}
    >
      {children}
    </Tag>
  );
}

export function MonoText({ children, className = "", as: Tag = "p", italic = false, bold = false, webglHero = false, noFluid = false }) {
  return (
    <Tag
      data-gl-text
      {...(webglHero ? { "data-gl-hero-text": true } : {})}
      {...(noFluid ? { "data-gl-text-no-fluid": true } : {})}
      className={`font-jakarta text-base uppercase leading-[25px] text-white ${italic ? "italic md:text-[22px] md:leading-[28px]" : ""} ${bold ? "font-bold" : "font-light"} ${className}`}
    >
      {children}
    </Tag>
  );
}
