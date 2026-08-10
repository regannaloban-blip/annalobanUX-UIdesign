import React, { useEffect, useRef, useState } from "react";

const contactEmail = "hello.anna.loban@proton.me";
export const briefHref = `mailto:${contactEmail}?subject=Website%20or%20visual%20system%20brief`;
export const contactFormId = "contact-form";

const scrambleGlyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*?<>/\\\\";

export function HoverText({ children, triggerOnParent = false }) {
  const text = String(children);
  const characters = Array.from(text);
  const labelRef = useRef(null);
  const frameRef = useRef(null);
  const [displayedCharacters, setDisplayedCharacters] = useState(characters);

  useEffect(() => () => window.cancelAnimationFrame(frameRef.current), []);

  useEffect(() => {
    window.cancelAnimationFrame(frameRef.current);
    setDisplayedCharacters(characters);
  }, [text]);

  const stopScramble = () => {
    window.cancelAnimationFrame(frameRef.current);
    setDisplayedCharacters(characters);
  };

  const startScramble = () => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    window.cancelAnimationFrame(frameRef.current);
    const startedAt = performance.now();

    const update = (time) => {
      const elapsed = time - startedAt;
      const nextCharacters = characters.map((character, index) => {
        if (character === " ") return character;
        const progress = elapsed - index * 40;

        if (progress >= 225) return character;
        return scrambleGlyphs[Math.floor(Math.random() * scrambleGlyphs.length)];
      });

      setDisplayedCharacters(nextCharacters);

      if (elapsed < 225 + characters.length * 40) {
        frameRef.current = window.requestAnimationFrame(update);
      }
    };

    frameRef.current = window.requestAnimationFrame(update);
  };

  useEffect(() => {
    if (!triggerOnParent) return undefined;

    const label = labelRef.current;
    const trigger = label?.closest("[data-hover-text-trigger]");
    if (!trigger) return undefined;

    trigger.addEventListener("pointerenter", startScramble);
    trigger.addEventListener("pointerleave", stopScramble);

    return () => {
      trigger.removeEventListener("pointerenter", startScramble);
      trigger.removeEventListener("pointerleave", stopScramble);
    };
  }, [triggerOnParent, text]);

  return (
    <span
      ref={labelRef}
      aria-label={text}
      className="interactive-label"
      onPointerEnter={triggerOnParent ? undefined : startScramble}
      onPointerLeave={triggerOnParent ? undefined : stopScramble}
    >
      <span aria-hidden="true" className="interactive-label-characters">
        {characters.map((character, index) => (
          <span className="interactive-character" key={`${character}-${index}`}>
            <span className="interactive-character-sizer">{character === " " ? "\u00a0" : character}</span>
            <span className="interactive-character-glyph">{displayedCharacters[index] === " " ? "\u00a0" : displayedCharacters[index]}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

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
      data-hover-text-trigger
      href={briefHref}
      onClick={scrollToContactForm}
      className={`group relative inline-flex h-12 w-fit items-center justify-center border-b border-black bg-white px-10 text-black active:scale-[0.99] ${className}`}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[-2px] hidden h-0 bg-[#A40000] transition-[height] duration-200 ease-out lg:block lg:group-hover:h-0.5" />
      <span
        data-color="black"
        className="relative z-10 block whitespace-nowrap font-jakarta text-base font-bold uppercase leading-[25px]"
      >
        <HoverText triggerOnParent>start a project</HoverText>
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
      className={`font-jakarta text-base uppercase leading-[25px] text-white ${italic ? "italic md:text-[22px] md:leading-[28px]" : ""} ${bold ? "font-bold" : "font-light"} ${className}`}
    >
      {children}
    </Tag>
  );
}
