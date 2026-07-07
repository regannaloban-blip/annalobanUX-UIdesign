import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { CanvasScene } from "./webgl/CanvasScene.js";

import aboutPortrait from "../assets/ai-portfolio/figma/anna-redesign/about.png";
import project1 from "../Case/Compressed/24 colab.jpg";
import project2 from "../Case/Compressed/smart business intelligence.jpg";
import project3 from "../Case/Compressed/Skyliner.jpg";
import project4 from "../Case/Compressed/your dissertation.jpg";
import quoteIcon from "../assets/ai-portfolio/figma/anna-redesign/quote-icon.svg";
import heroBackground from "../assets/ai-portfolio/image 16.png";
import footerFormImage from "../Case/Compressed/contact.jpg";

const contactEmail = "hello.anna.loban@proton.me";
const briefHref = `mailto:${contactEmail}?subject=Website%20or%20visual%20system%20brief`;
const formSubmitHref = `https://formsubmit.co/${contactEmail}`;
const canvasSceneKey = "__annaPortfolioCanvasScene";
const footerLinks = [
  { label: "Linkedin", href: "https://www.linkedin.com/in/annloban/" },
  { label: "Dribbble", href: "https://dribbble.com/azzaza" },
  { label: "telegram", href: "https://t.me/anna_loban" },
  { label: "mail", href: briefHref, external: false },
];

const works = [
  {
    kind: "site/",
    name: "24 colab",
    href: "https://24colab.com/",
    image: project1,
  },
  {
    kind: "site/",
    name: "smart business intelligence",
    href: "https://smartbusinessintelligence.co.uk",
    image: project2,
    imageClass: "scale-[1.02]",
    maskBottomEdge: true,
  },
  {
    kind: "brand identity/",
    name: "Skyliner",
    href: "https://skyliner.rv.ua/",
    image: project3,
  },
  {
    kind: "site/",
    name: "your dissertation",
    href: "https://yourdissertation.com",
    image: project4,
  },
];

const advantageCards = [
  {
    number: "01/",
    title: "Easy to use hard to ignore",
    text: "Composition as the first signal of trust. Guiding users to target actions through visual logic.",
  },
  {
    number: "02/",
    title: "Nothing extra, nothing distracting.",
    text: "Less guesswork, more precision. No endless revisions — just one sharp, effective strategy.",
  },
  {
    number: "03/",
    title: "Modern & AI-powered workflows.",
    text: "Solid infrastructure. Developer-ready Figma component sets built to stand out.",
  },
];

const services = [
  "+ UX/UI solutions",
  "+ Identity & web design",
  "+ Frontend-ready systems",
  "+ AI-fast workflow",
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useDesktopEffects() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return desktop;
}

function Preloader({ reduced }) {
  const rootRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current || !titleRef.current) return;
    if (reduced) {
      gsap.to(rootRef.current, {
        autoAlpha: 0,
        duration: 0.2,
        delay: 0.2,
        onComplete: () => rootRef.current?.remove(),
      });
      return;
    }

    const split = new SplitType(titleRef.current, {
      types: "chars,words",
      charClass: "preloader-char",
      wordClass: "preloader-word",
    });
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        split.revert();
        rootRef.current?.remove();
      },
    });

    tl.to(split.chars, {
      color: "#e60006",
      textShadow: "0 0 10px rgba(255,0,0,.75), 0 0 24px rgba(255,0,0,.45)",
      filter: "blur(5px)",
      stagger: { each: 0.1, from: "start" },
      duration: 0.55,
    })
      .to(
        rootRef.current,
        {
          filter: "blur(500px)",
          duration: 1,
        },
        "exit",
      )
      .to(
        rootRef.current,
        {
          opacity: 0,
          duration: 1,
        },
        "exit+=0.1",
      );

    return () => {
      tl.kill();
      split.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="fixed inset-0 z-[1000] flex h-screen w-full items-center justify-center bg-black pointer-events-none"
    >
      <h1
        ref={titleRef}
        className="font-display text-4xl font-semibold uppercase text-white md:text-6xl"
      >
        Initializing
      </h1>
    </section>
  );
}

function CanvasLayer({ enabled }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    document.querySelectorAll("[data-webgl-canvas]").forEach((element) => {
      if (element !== canvas) element.remove();
    });
    window[canvasSceneKey]?.destroy?.();

    let active = true;
    const scene = new CanvasScene({
      canvas,
      enableSmoothScroll: false,
      onReady: () => {
        if (!active) return;
        canvas.dataset.webglState = "ready";
        document.body.classList.add("gl-ready");
      },
      onFallback: () => {
        if (!active) return;
        canvas.dataset.webglState = "fallback";
        document.body.classList.remove("gl-ready");
      },
    });
    window[canvasSceneKey] = scene;

    return () => {
      active = false;
      scene.destroy();
      if (window[canvasSceneKey] === scene) delete window[canvasSceneKey];
      canvas.style.opacity = "0";
      delete canvas.dataset.webglState;
      document.body.classList.remove("gl-ready");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      key="fluid-overlay-v2"
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[900] h-[100dvh] w-screen opacity-0"
      data-webgl-canvas
    />
  );
}

function Button({ className = "", webglHero = false }) {
  return (
    <a
      {...(webglHero ? { "data-gl-hero-background": true } : {})}
      href={briefHref}
      className={`inline-flex h-12 w-fit items-center justify-center border-b border-black bg-white px-10 text-black ${className}`}
    >
      <span
        data-gl-text
        data-gl-text-no-fluid={!webglHero ? true : undefined}
        {...(webglHero ? { "data-gl-hero-text": true } : {})}
        data-color="black"
        className="block whitespace-nowrap font-jakarta text-base font-bold uppercase leading-[25px]"
      >
        start a project
      </span>
    </a>
  );
}

function SectionShell({ children, className = "", shellClassName = "", decor = null }) {
  return (
    <section className={`relative w-full ${className}`}>
      <div className={`section-shell ${shellClassName}`}>
        {decor && (
          <div className="decor-layer pointer-events-none absolute inset-0 z-20" aria-hidden="true">
            {decor}
          </div>
        )}
        <div className="content-layer relative z-10">{children}</div>
      </div>
    </section>
  );
}

function FooterField({
  label,
  name,
  placeholder,
  value,
  onBlur,
  onChange,
  error,
  type = "text",
  as = "input",
  className = "",
  required = true,
}) {
  const FieldTag = as;

  return (
    <label className={`relative flex min-w-0 flex-col gap-1 ${className}`}>
      <span className="font-jakarta text-[14px] font-semibold normal-case leading-5 text-white/40">
        {label}
      </span>
      <FieldTag
        aria-invalid={error ? "true" : "false"}
        className={`footer-field-control min-w-0 w-full rounded-[1px] border border-[#94A3B8] bg-transparent px-[11px] font-jakarta text-base font-normal normal-case leading-6 text-white/60 outline-none placeholder:text-white/60 ${
          as === "textarea" ? "h-[100px] resize-none py-[15px]" : "h-14"
        }`}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        onInput={onChange}
        placeholder={placeholder}
        required={required}
        type={as === "input" ? type : undefined}
        value={value}
      />
      {required && (
        <span
          aria-live="polite"
          className={`absolute left-0 top-full z-10 mt-1 flex items-center gap-1 font-jakarta text-[14px] font-semibold normal-case leading-5 text-white ${
            error ? "visible" : "invisible pointer-events-none"
          }`}
        >
          <span className="h-1 w-1 rounded-full bg-white" />
          {error || "Validation message"}
        </span>
      )}
    </label>
  );
}

function Display({ as: Tag = "h2", children, className = "", buffon = false, webglHero = false }) {
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

function MonoText({ children, className = "", as: Tag = "p", italic = false, bold = false, webglHero = false }) {
  return (
    <Tag
      data-gl-text
      {...(webglHero ? { "data-gl-hero-text": true } : {})}
      className={`font-jakarta text-base uppercase leading-[25px] text-white ${italic ? "italic md:text-[22px] md:leading-[28px]" : ""} ${bold ? "font-bold" : "font-light"} ${className}`}
    >
      {children}
    </Tag>
  );
}

function TopLinks() {
  return (
    <nav className="relative z-40 flex w-full flex-wrap items-start justify-between gap-x-6 gap-y-2 font-jakarta text-base uppercase leading-[25px] text-white lg:justify-end lg:gap-[40px]">
      {footerLinks.map((link) => (
        <a
          data-gl-text
          data-gl-hero-text
          href={link.href}
          target={link.external === false ? undefined : "_blank"}
          rel={link.external === false ? undefined : "noreferrer"}
          className="underline"
          key={link.label}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

const desktopGridStops = ["0%", "33.333333%", "66.666667%", "100%"];

function FirstViewportGuide() {
  const labels = [
    { stop: desktopGridStops[0], text: "Personal page" },
    { stop: desktopGridStops[1], text: "Poland, Poznan" },
  ];

  return (
    <div className="desktop-hero-grid-rail pointer-events-none absolute top-[-59px] z-20 hidden h-[calc(100dvh+2px)] min-[1440px]:block" aria-hidden="true">
      {desktopGridStops.map((stop) => (
        <span
          key={stop}
          className="absolute top-0 h-full w-px bg-gradient-to-b from-white/20 via-white/20 to-transparent"
          style={{ left: stop }}
        />
      ))}
      {labels.map((label) => (
        <div
          key={label.text}
          className="desktop-hero-grid-anchor absolute top-[236px] flex h-[25px] items-center gap-[22px] font-jakarta text-[13px] uppercase leading-[25px] text-white/40"
          style={{ left: label.stop }}
        >
          <span className="relative block h-[20px] w-[20px] shrink-0">
            <span data-gl-hero-background className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white" />
            <span data-gl-hero-background className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white" />
          </span>
          <span>{label.text}</span>
        </div>
      ))}
    </div>
  );
}

function StableHeroGridOverlay() {
  const labels = [
    { stop: desktopGridStops[0], text: "Personal page" },
    { stop: desktopGridStops[1], text: "Poland, Poznan" },
  ];

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[-2px] z-[950] hidden h-[calc(100dvh+2px)] min-[1440px]:block" aria-hidden="true">
      <div className="section-shell relative h-full">
        <div className="desktop-hero-grid-rail absolute inset-y-0">
          {desktopGridStops.map((stop) => (
            <span
              key={stop}
              className="absolute top-0 h-full w-px bg-gradient-to-b from-white/20 via-white/20 to-transparent"
              style={{ left: stop }}
            />
          ))}
          {labels.map((label) => (
            <div
              key={label.text}
              className="desktop-hero-grid-anchor absolute top-[236px] flex h-[25px] items-center gap-[22px] font-jakarta text-[13px] uppercase leading-[25px] text-white/40"
              style={{ left: label.stop }}
            >
              <span className="relative block h-[20px] w-[20px] shrink-0">
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white" />
              </span>
              <span>{label.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlusMarker({ className = "" }) {
  return (
    <span className={`relative block h-[20px] w-[20px] shrink-0 ${className}`} aria-hidden="true">
      <span data-gl-hero-background className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white" />
      <span data-gl-hero-background className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white" />
    </span>
  );
}

function HeroTopBrief() {
  return (
    <div className="desktop-hero-grid-rail pointer-events-none absolute top-0 z-30 hidden h-[260px] min-[1440px]:block">
      <div
        className="desktop-hero-grid-anchor hero-top-brief-card pointer-events-auto absolute top-[180px] flex items-start gap-[11px]"
        style={{ left: desktopGridStops[2] }}
      >
        <PlusMarker />
        <div className="mt-[-4px] flex min-w-0 flex-1 flex-col items-start gap-[26px] pr-8">
          <MonoText webglHero italic className="w-full !text-[20px] font-normal !leading-[33px] md:!text-[20px] md:!leading-[33px]">
            Digital design beyond trends — built to be clear, logical, and easy to launch.
          </MonoText>
          <Button webglHero />
        </div>
      </div>
    </div>
  );
}

function ResponsiveViewportGuide() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[-220px] z-20 h-[1054px] min-[600px]:max-md:top-[-220px] min-[600px]:max-md:h-[1054px] md:top-[-140px] md:h-[1072px] min-[1440px]:hidden" aria-hidden="true">
      <span className="absolute left-[10px] top-0 h-full w-px bg-gradient-to-b from-white/25 via-white/25 to-transparent" />
      <span className="absolute right-[10px] top-0 h-full w-px bg-gradient-to-b from-white/25 via-white/25 to-transparent" />
    </div>
  );
}

function ResponsiveIntro() {
  return (
    <section className="responsive-intro relative mt-[59px] w-full min-[600px]:max-md:mx-auto min-[600px]:max-md:mt-0 min-[600px]:max-md:w-[598px] md:mt-0 md:w-[775px] min-[1024px]:w-full min-[1440px]:hidden">
      <div className="hero-cta-block absolute left-0 top-[7px] z-20 flex w-[390px] max-w-none items-start gap-[11px] min-[600px]:max-md:top-[66px] md:top-[112px]">
        <PlusMarker className="mt-2" />
        <div className="flex w-[359px] shrink-0 flex-col items-start gap-[26px] pr-8">
          <MonoText italic className="w-full !text-[20px] font-normal !leading-[33px] md:!text-[20px] md:!leading-[33px]">
            Digital design beyond trends — built to be clear, logical, and easy to launch.
          </MonoText>
          <Button className="h-12" />
        </div>
      </div>

      <div className="absolute left-0 top-0 h-[425px] w-full overflow-visible">
        <img
          src={heroBackground}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-[104px] h-[407px] w-[750px] max-w-none object-cover opacity-100 blur-[6px] min-[600px]:max-md:left-0 min-[600px]:max-md:top-[104px] min-[600px]:max-md:h-[407px] min-[600px]:max-md:w-[750px] md:left-0 md:top-[-22px] md:h-[608px] md:w-[1120px]"
        />
        <div className="hero-title-block absolute left-0 top-[280px] z-10 w-full min-[600px]:max-md:top-[339px] md:top-[365px]">
          <h1 data-gl-text className="mb-[-16px] w-fit whitespace-nowrap font-buffon text-[84px] font-normal uppercase leading-[85px] text-white md:leading-[122px] md:text-[132px]">
            Hello!
          </h1>
          <div className="hero-anna-row w-full">
            <h2 data-gl-text className="w-fit whitespace-nowrap font-display text-[78px] font-light uppercase leading-[84px] tracking-[-3.12px] text-white min-[600px]:shrink-0 min-[600px]:text-right md:text-[126px] md:leading-[136px] md:tracking-[-5.04px]">
              Iam ANNa
            </h2>
          </div>
        </div>
      </div>

      <div className="ux-block relative flex flex-col items-start">
        <div className="ux-title-row flex w-full flex-col gap-6 pb-1 pt-2">
          <MonoText className="ux-mini-text ml-auto w-full max-w-[296px] font-normal">
            Shaping clear visual interfaces for thoughtful digital products and the people who use them.
          </MonoText>
          <h2 data-gl-text className="ux-title font-display text-[78px] font-light uppercase leading-[84px] tracking-[-3.12px] text-white">
            UX/UI
          </h2>
        </div>
        <div className="flex w-full flex-col items-start text-white min-[600px]:max-md:h-[160px] md:h-[242px]">
          <h2 data-gl-text className="mb-[-16px] font-buffon text-[84px] font-normal uppercase leading-[85px] text-white md:h-[122px] md:w-full md:text-[132px] md:leading-[122px]">
            Product
          </h2>
          <div className="flex w-full flex-col items-start whitespace-nowrap min-[600px]:h-[91px] min-[600px]:flex-row min-[600px]:justify-between md:h-[136px]">
            <div className="order-2 flex flex-col pt-4 font-jakarta text-base font-normal uppercase leading-[25px] text-white min-[600px]:order-1">
              <span data-gl-text className="inline-block whitespace-nowrap">/ Web</span>
              <span data-gl-text className="inline-block whitespace-nowrap">/ Graphic</span>
              <span data-gl-text className="inline-block whitespace-nowrap">/ identity</span>
            </div>
            <h2 data-gl-text className="order-1 font-display text-[78px] font-light uppercase leading-[84px] tracking-[-3.12px] text-white min-[600px]:order-2 min-[600px]:w-fit md:whitespace-nowrap md:text-[126px] md:leading-[136px] md:tracking-[-5.04px]">
              Designer
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundGlow() {
  return (
    <img
      data-gl-hero-media
      src={heroBackground}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute left-[17%] top-[-64px] z-0 h-[420px] w-[780px] max-w-none object-cover opacity-100 blur-[6px] md:left-[18%] md:top-[-86px] md:h-[560px] md:w-[980px] lg:left-[302px] lg:top-[50px] lg:h-[608px] lg:w-[1120px]"
    />
  );
}

function Hero() {
  return (
    <header className="relative hidden h-[748px] w-full flex-col gap-2 overflow-visible pb-0 pt-[354px] min-[1440px]:flex">
      <BackgroundGlow />
      <div className="relative z-10 flex w-full items-center">
        <Display as="h1" buffon webglHero>
          Hello!
        </Display>
      </div>
      <div className="relative z-10 flex w-full items-end lg:pl-[287px]">
        <Display as="h2" className="text-right lg:tracking-[-6.72px]" webglHero>
          Iam ANNa
        </Display>
      </div>
    </header>
  );
}

function ProductIntro() {
  return (
    <section className="hidden h-[592px] w-full flex-col items-start py-[72px] min-[1440px]:flex">
      <div className="flex h-[158px] w-full flex-col gap-10 pb-1 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <Display className="lg:tracking-[-6.72px]" webglHero>UX/UI</Display>
        <div className="flex w-[286px] max-w-full flex-col items-start gap-[42px] lg:h-[75px] lg:w-[359px] lg:gap-0 lg:pr-8">
          <MonoText webglHero className="w-full max-w-[327px] font-normal">
            Shaping clear visual interfaces for thoughtful digital products and the people who use them.
          </MonoText>
        </div>
      </div>
      <div className="flex w-full flex-col items-start text-white">
        <Display buffon webglHero className="lg:mb-[-24px]">
          Product
        </Display>
        <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-start lg:gap-[194px]">
          <div className="order-2 flex flex-row gap-4 pt-0 font-jakarta text-base font-normal uppercase leading-[25px] text-white lg:order-1 lg:flex-col lg:gap-0 lg:pt-4">
            <span data-gl-text data-gl-hero-text className="inline-block whitespace-nowrap">/ Web</span>
            <span data-gl-text data-gl-hero-text className="inline-block whitespace-nowrap">/ Graphic</span>
            <span data-gl-text data-gl-hero-text className="inline-block whitespace-nowrap">/ identity</span>
          </div>
          <Display webglHero className="order-1 lg:order-2 lg:tracking-[-6.72px]">Designer</Display>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section relative ml-auto w-full max-w-[1202px]">
      <div className="about-layout ml-auto flex w-full max-w-[1020px] items-start gap-4">
        <div className="about-icon relative h-[31px] shrink-0" data-gl-fluid-boost>
          <img data-gl-media data-gl-hero-media data-gl-fluid-boost src={quoteIcon} alt="" className="absolute top-[6px] h-[25px] w-[28px]" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[91px]">
          <div data-gl-flow-text data-gl-fluid-boost className="about-copy flow-root font-jakarta text-[20px] font-normal uppercase leading-[32px] text-white md:text-[26px] md:leading-[41px]">
            <div
              data-gl-media
              data-gl-hero-media
              data-gl-flow-exclude
              className="about-photo float-right ml-5 h-[200px] w-[200px] overflow-hidden bg-white md:ml-7 md:h-[239px] md:w-[239px] lg:ml-6"
            >
              <img src={aboutPortrait} alt="Anna Loban portrait" className="h-full w-full object-cover" />
            </div>
            <span data-gl-text data-gl-text-no-fluid>About. </span>
            <span data-gl-text data-gl-text-no-fluid className="text-white/60">
              I am a senior UX/UI designer. Strong product structure and refined visuals go hand in hand. Working independently, I create design systems that move business forward and save development time.{" "}
            </span>
            <span data-gl-text data-gl-text-no-fluid>The result: no chaotic iterations — just constructive decisions that make sense.</span>
          </div>
          <div className="flex h-[165px] w-[353px] max-w-full flex-col gap-[42px] pr-6">
            <MonoText webglHero className="font-normal">Combining real human behavior, clear product logic, and strong visual appeal.</MonoText>
            <Button webglHero />
          </div>
        </div>
      </div>
    </section>
  );
}

function PurposeMiniText({ webglHero = false }) {
  return (
    <div className="shrink-0 pt-1">
      <MonoText webglHero={webglHero} className="h-[75px] w-[264px] font-normal !text-base !leading-[25px]">
        A web/UI designer crafting intuitive and engaging digital experiences
      </MonoText>
    </div>
  );
}

function PurposeTitle() {
  return (
    <div className="w-full">
      <div className="flex w-full flex-col min-[600px]:hidden">
        <div className="flex w-full flex-col items-end gap-6">
          <PurposeMiniText />
          <h2 data-gl-text data-gl-hero-text className="w-full font-display text-[78px] font-light uppercase leading-[84px] tracking-[-3.12px] text-white">
            design
            <br />
            with
          </h2>
        </div>
        <h2 data-gl-text data-gl-hero-text className="h-[85px] whitespace-nowrap font-buffon text-[84px] font-normal uppercase leading-[85px] text-white">
          purpose
        </h2>
      </div>

      <div className="hidden w-full flex-col min-[600px]:max-[872px]:flex">
        <div className="flex h-[84px] w-full items-start justify-between">
          <h2 data-gl-text data-gl-hero-text className="whitespace-nowrap font-display text-[78px] font-light uppercase leading-[84px] tracking-[-3.12px] text-white">
            digital
          </h2>
          <PurposeMiniText webglHero />
        </div>
        <h2 data-gl-text data-gl-hero-text className="h-[84px] w-full whitespace-nowrap font-display text-[78px] font-light uppercase leading-[84px] tracking-[-3.12px] text-white">
          design with
        </h2>
        <h2 data-gl-text data-gl-hero-text className="h-[85px] whitespace-nowrap font-buffon text-[84px] font-normal uppercase leading-[85px] text-white">
          purpose
        </h2>
      </div>

      <div className="hidden w-full flex-col min-[873px]:max-[1439px]:flex">
        <div className="flex h-[136px] w-full items-start justify-between">
          <h2 data-gl-text data-gl-hero-text className="w-[437px] whitespace-nowrap text-right font-display text-[126px] font-light uppercase leading-[136px] tracking-[-5.04px] text-white">
            digital
          </h2>
          <PurposeMiniText webglHero />
        </div>
        <h2 data-gl-text data-gl-hero-text className="h-[136px] w-full whitespace-nowrap text-center font-display text-[126px] font-light uppercase leading-[136px] tracking-[-5.04px] text-white">
          design with
        </h2>
        <h2 data-gl-text data-gl-hero-text className="mt-[11px] h-[122px] w-[544px] whitespace-nowrap font-buffon text-[132px] font-normal uppercase leading-[122px] text-white">
          purpose
        </h2>
      </div>

      <div className="hidden w-full min-[1440px]:block">
        <div className="flex h-[154px] w-full items-start gap-28">
          <Display webglHero className="!text-[168px] !leading-[154px] !tracking-[-6.72px]">digital</Display>
          <div className="pt-2">
            <MonoText webglHero className="h-[75px] w-[264px] font-normal !text-base !leading-[25px]">
              A web/UI designer crafting intuitive and engaging digital experiences
            </MonoText>
          </div>
        </div>
        <div className="flex h-[154px] w-full items-center pl-[270px]">
          <Display webglHero className="!text-[168px] !leading-[154px] !tracking-[-6.72px]">design with</Display>
        </div>
        <div className="flex h-[181px] w-full items-end pl-[178px]">
          <Display webglHero buffon className="!text-[175px] !leading-[180.7px] tracking-[3.5px]">
            purpose
          </Display>
        </div>
      </div>
    </div>
  );
}

function Purpose() {
  return (
    <section className="flex w-full flex-col py-[40px] min-[1440px]:py-[72px]">
      <PurposeTitle />

      <div className="purpose-columns mt-16 flex w-full flex-col gap-[72px] min-[873px]:mt-0 min-[873px]:flex-row min-[873px]:items-start min-[873px]:justify-between min-[873px]:gap-20">
        <div className="flex w-full flex-col gap-[24px] min-[873px]:w-[362px] min-[873px]:gap-10 min-[873px]:max-[1439px]:pt-[344px] min-[1440px]:pt-[280px]">
          {advantageCards.map((card) => (
            <div className="flex w-full items-start gap-[32px]" key={card.number}>
              <MonoText bold className="h-[25px] shrink-0 whitespace-nowrap">
                {card.number}
              </MonoText>
              <div className="flex min-w-0 flex-1 flex-col gap-5">
                <MonoText bold>{card.title}</MonoText>
                <MonoText className="font-normal">{card.text}</MonoText>
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col gap-4 min-[873px]:max-[1439px]:w-[251px] min-[873px]:max-[1439px]:pt-16 min-[1440px]:h-[361px] min-[1440px]:w-[359px] min-[1440px]:pr-[108px]">
          <MonoText webglHero className="w-full max-w-full font-normal min-[873px]:w-[251px]">
            Delivering tailored solutions for my <br className="hidden max-md:block" /> clients
          </MonoText>
          <div className="flex w-full flex-col gap-[42px] min-[873px]:w-[251px] min-[873px]:max-w-full">
            <div data-gl-background data-gl-hero-background className="flex w-full flex-col overflow-hidden border-y border-white">
              {services.map((service, index) => (
                <div data-gl-background data-gl-hero-background className={`flex h-[41px] items-center min-[1440px]:h-[42px] ${index === 0 ? "" : "border-t border-white"}`} key={service}>
                  <MonoText webglHero className="whitespace-nowrap font-normal">{service}</MonoText>
                </div>
              ))}
            </div>
            <Button webglHero />
          </div>
        </div>
      </div>
    </section>
  );
}

function WorksHeading() {
  return (
    <section className="mt-0 flex w-full flex-col gap-2 py-[40px] min-[1440px]:py-[72px]">
      <div className="flex w-full flex-wrap items-end justify-between gap-y-[12px]">
        <Display webglHero className="shrink-0 !text-[78px] !leading-[84px] !tracking-[-3.12px] min-[873px]:max-[1439px]:!text-[126px] min-[873px]:max-[1439px]:!leading-[136px] min-[873px]:max-[1439px]:!tracking-[-5.04px] min-[1440px]:!text-[168px] min-[1440px]:!leading-[154px] min-[1440px]:!tracking-[-6.72px]">some</Display>
        <Display webglHero className="ml-auto shrink-0 !text-[78px] !leading-[84px] !tracking-[-3.12px] min-[873px]:max-[1439px]:!text-[126px] min-[873px]:max-[1439px]:!leading-[136px] min-[873px]:max-[1439px]:!tracking-[-5.04px] min-[1440px]:!text-[168px] min-[1440px]:!leading-[154px] min-[1440px]:!tracking-[-6.72px]">of my</Display>
      </div>
      <div className="flex w-full items-center pl-0 min-[600px]:pl-[140px] min-[1440px]:pl-[188px]">
        <Display webglHero buffon className="w-full !text-[84px] !leading-[85px] min-[873px]:max-[1439px]:!text-[132px] min-[873px]:max-[1439px]:!leading-[122px] min-[1440px]:!text-[175px] min-[1440px]:!leading-[180.7px] min-[1440px]:tracking-[1.75px]">
          works
        </Display>
      </div>
    </section>
  );
}

function ProjectCard({ work, className = "" }) {
  return (
    <article className={`flex w-[368px] max-w-full flex-col gap-3 ${className}`}>
      <p data-gl-text data-gl-hero-text className="font-jakarta text-[13px] font-normal uppercase leading-[25px] text-white/40">
        {work.kind}
      </p>
      <div data-gl-media data-gl-hero-media className="relative h-[480px] w-full overflow-hidden bg-white lg:h-[480px]">
        <img src={work.image} alt="" className={`h-full w-full object-cover ${work.imageClass ?? ""}`} />
        {work.maskBottomEdge ? <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[6px] bg-[#062322]" /> : null}
      </div>
      <div
        data-gl-background
        data-gl-hero-background
        className="flex w-full items-start justify-between gap-4 border-b border-white pb-3 font-mono text-base uppercase leading-[25px] text-white md:max-lg:pb-[11px]"
      >
        <span data-gl-text data-gl-hero-text className="min-w-0 whitespace-nowrap">
          {work.name}
        </span>
        <a data-gl-text data-gl-hero-text href={work.href} target="_blank" rel="noreferrer" className="shrink-0 underline">
          Live
        </a>
      </div>
    </article>
  );
}

function Works() {
  return (
    <section className="mt-0 w-full">
      <div className="flex w-full flex-col gap-[72px] py-[40px] min-[1440px]:hidden">
        <div className="flex w-full justify-start min-[600px]:justify-end">
          <ProjectCard work={works[0]} />
        </div>
        <div className="flex w-full justify-start">
          <ProjectCard work={works[2]} />
        </div>
      </div>

      <div className="hidden w-full min-[1440px]:block">
        <div className="flex h-[710px] w-full items-start justify-between py-[72px]">
          <div className="flex items-center gap-[113px]">
            <ProjectCard work={works[0]} />
            <ProjectCard work={works[1]} />
          </div>
          <MonoText webglHero className="w-[257px] font-normal">Users always compare options.</MonoText>
        </div>
        <div className="flex h-[710px] w-full items-start justify-between py-[72px]">
          <MonoText webglHero className="w-[271px] font-normal">The context changes with the audience.</MonoText>
          <div className="flex items-center gap-[112px]">
            <ProjectCard work={works[2]} />
            <ProjectCard work={works[3]} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const [formValues, setFormValues] = useState({
    email: "",
    name: "",
    project: "",
    message: "",
  });
  const [formTouched, setFormTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const validateFooterForm = (values) => {
    const errors = {};

    if (!values.email.trim()) {
      errors.email = "Please fill out this field.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!values.name.trim()) {
      errors.name = "Please fill out this field.";
    }

    return errors;
  };

  const formErrors = validateFooterForm(formValues);
  const getFieldError = (fieldName) => (formSubmitted || formTouched[fieldName] ? formErrors[fieldName] : "");
  const updateField = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };
  const markFieldTouched = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
    setFormTouched((current) => ({ ...current, [name]: true }));
  };
  const submitFooterForm = (event) => {
    setFormSubmitted(true);

    if (Object.keys(formErrors).length > 0) {
      event.preventDefault();
    }
  };

  return (
    <section className="relative mt-0 flex w-full flex-col pt-[40px] md:max-lg:w-[775px] lg:mt-0 lg:h-[874px] lg:pt-[72px]">
      <div className="flex w-full items-start justify-between">
        <p data-gl-flow-text data-gl-fluid-boost className="font-jakarta text-[13px] font-normal uppercase leading-[25px] text-white/40">
          Start a project
        </p>
        <p data-gl-text data-gl-hero-text className="w-[288px] font-jakarta text-base font-normal uppercase leading-[25px] text-right text-white lg:w-[180px] lg:font-mono">
          Open for a few
          <br />
          selected projects
        </p>
      </div>

      <h2 data-gl-flow-text data-gl-fluid-boost className="mt-[32px] font-display text-[32px] font-light uppercase leading-[48px] tracking-[-2.24px] text-white md:text-[54px] md:leading-[62px] md:tracking-[-0.5px] md:max-lg:!mt-[40px] md:max-lg:!text-[56px] md:max-lg:!leading-[74px] md:max-lg:!tracking-[-3.92px] lg:mt-[40px] lg:text-[96px] lg:leading-[106px] lg:tracking-[-6.72px]">
        <span>Let`s create something</span>
        <br />
        <span className="text-white/35">amazing</span>{" "}
        <span>together</span>
      </h2>

      <div className="mt-[32px] grid w-full grid-cols-1 py-6 md:max-lg:!mt-[40px] md:max-lg:h-[460px] lg:mt-[40px] lg:h-[460px] lg:grid-cols-[3fr_9fr] lg:gap-[40px] lg:p-6 min-[1440px]:grid-cols-[496px_minmax(0,1fr)]">
        <div data-gl-media className="contact-image-frame relative order-2 hidden h-[412px] w-[496px] max-w-full overflow-hidden lg:order-1 lg:block lg:w-full min-[1440px]:w-[496px]">
          <img
            src={footerFormImage}
            alt=""
            aria-hidden="true"
            className="contact-image h-full w-full object-cover md:max-lg:ml-[-11px] md:max-lg:mt-[-10px] md:max-lg:h-[432px] md:max-lg:w-[749px] md:max-lg:max-w-none"
          />
          <img
            src={footerFormImage}
            alt=""
            aria-hidden="true"
            className="contact-image-slice contact-image-slice--one"
          />
          <img
            src={footerFormImage}
            alt=""
            aria-hidden="true"
            className="contact-image-slice contact-image-slice--two"
          />
        </div>

        <form action={formSubmitHref} method="POST" className="order-1 flex min-w-0 flex-col gap-[24px] max-md:gap-[32px] md:order-2 md:max-lg:!order-1 md:max-lg:!h-[412px] md:max-lg:!w-full md:max-lg:!gap-[32px] lg:gap-[32px]" aria-label="Project request form" noValidate onSubmit={submitFooterForm}>
          <input type="hidden" name="_subject" value="New portfolio project request" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_replyto" value={formValues.email} />
          <div data-gl-ignore-fluid className="flex w-full flex-col gap-[24px]">
            <FooterField
              error={getFieldError("email")}
              label="Email*"
              name="email"
              onBlur={markFieldTouched}
              onChange={updateField}
              placeholder="example@gmail.com"
              type="email"
              value={formValues.email}
            />
            <div className="grid min-w-0 w-full grid-cols-2 gap-3 md:grid-cols-1 md:gap-6 md:max-lg:!grid-cols-2 md:max-lg:!gap-3 lg:grid-cols-2 lg:gap-3">
              <FooterField
                error={getFieldError("name")}
                label="Full name*"
                name="name"
                onBlur={markFieldTouched}
                onChange={updateField}
                placeholder="Jane Smith"
                value={formValues.name}
              />
              <FooterField
                label="Company name"
                name="project"
                onBlur={markFieldTouched}
                onChange={updateField}
                placeholder="Orange"
                required={false}
                value={formValues.project}
              />
            </div>
            <FooterField
              as="textarea"
              label="Message"
              name="message"
              onBlur={markFieldTouched}
              onChange={updateField}
              placeholder="Type your message here..."
              required={false}
              value={formValues.message}
            />
          </div>
          <button
            data-gl-hero-background
            className="flex h-12 w-full items-center justify-center border-b border-black bg-white px-10 font-jakarta text-base font-bold uppercase leading-[25px] text-black"
            type="submit"
          >
            <span data-gl-text data-gl-hero-text data-color="black" className="block whitespace-nowrap leading-[25px]">Start a project</span>
          </button>
        </form>
      </div>
    </section>
  );
}

function LoopStart() {
  return (
    <section className="pointer-events-none relative hidden h-screen w-full overflow-clip min-[1440px]:block" aria-hidden="true">
      <div className="absolute left-0 top-0 flex w-full flex-col gap-[154px]">
        <Hero />
      </div>
    </section>
  );
}

export default function App() {
  const reduced = useReducedMotion();
  const desktopEffects = useDesktopEffects();
  const page = useMemo(
    () => (
      <>
        <SectionShell className="z-50">
          <TopLinks />
        </SectionShell>
        <SectionShell
          decor={
            <>
              <ResponsiveViewportGuide />
              <HeroTopBrief />
            </>
          }
        >
          <ResponsiveIntro />
          <Hero />
        </SectionShell>
        <SectionShell>
          <ProductIntro />
        </SectionShell>
        <SectionShell>
          <About />
        </SectionShell>
        <SectionShell>
          <Purpose />
        </SectionShell>
        <SectionShell>
          <WorksHeading />
        </SectionShell>
        <SectionShell>
          <Works />
        </SectionShell>
        <SectionShell>
          <Footer />
        </SectionShell>
      </>
    ),
    [],
  );

  return (
    <>
      <Preloader reduced={reduced} />
      <CanvasLayer enabled={desktopEffects && !reduced} />
      <StableHeroGridOverlay />
      <main className="relative z-10 flex min-h-screen flex-col gap-0 overflow-x-hidden pb-5 pt-[49px] lg:gap-0 lg:pb-[40px] lg:pt-[32px]" aria-label="Anna Loban portfolio">
        <div className="relative z-10 flex flex-col gap-0">
          {page}
        </div>
      </main>
    </>
  );
}
