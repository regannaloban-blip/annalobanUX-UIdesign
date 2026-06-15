import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";

import aboutPortrait from "../assets/ai-portfolio/figma/anna-redesign/about.png";
import project1 from "../assets/ai-portfolio/figma/anna-redesign/project-1.png";
import project2 from "../assets/ai-portfolio/figma/anna-redesign/project-2.png";
import project3 from "../assets/ai-portfolio/figma/anna-redesign/project-3.png";
import project4 from "../assets/ai-portfolio/figma/anna-redesign/project-4.png";
import quoteIcon from "../assets/ai-portfolio/figma/anna-redesign/quote-icon.svg";
import heroBackground from "../assets/ai-portfolio/figma/anna-redesign/hero-background-var2.png";
import footerFormImage from "../assets/ai-portfolio/figma/anna-redesign/footer-form-image.png";

const briefHref = "mailto:ann.loban@gmail.com?subject=Website%20or%20visual%20system%20brief";
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
    name: "your dissertation",
    href: "https://yourdissertation.com",
    image: project2,
  },
  {
    kind: "site/",
    name: "smart business intelligence",
    href: "https://smartbusinessintelligence.co.uk",
    image: project3,
  },
  {
    kind: "brand identity/",
    name: "Vegas Expert",
    href: "https://www.behance.net/gallery/55414069/Vegas-Expert-Package",
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

function Button({ className = "" }) {
  return (
    <a
      href={briefHref}
      className={`inline-flex h-12 w-fit items-center justify-center border-b border-black bg-white px-10 text-black ${className}`}
    >
      <span className="block whitespace-nowrap font-jakarta text-base font-bold uppercase leading-[25px]">
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

function Display({ as: Tag = "h2", children, className = "", buffon = false }) {
  const fontClass = buffon ? "font-buffon font-normal" : "font-display font-light";
  const sizeClass = buffon
    ? "text-[84px] leading-[85px] md:text-[118px] md:leading-[110px] lg:text-[175px] lg:leading-[160px]"
    : "text-[78px] leading-[84px] tracking-[-3.12px] md:text-[96px] md:leading-[94px] lg:text-[168px] lg:leading-[154px] lg:tracking-[-7px]";

  return (
    <Tag
      {...(!buffon ? { "data-gl-text": true } : {})}
      className={`${fontClass} ${sizeClass} whitespace-nowrap uppercase tracking-normal text-white ${className}`}
    >
      {children}
    </Tag>
  );
}

function MonoText({ children, className = "", as: Tag = "p", italic = false, bold = false }) {
  return (
    <Tag
      data-gl-text
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

function FirstViewportGuide() {
  const firstLine = 10;
  const lastLine = 1390;
  const lineStep = (lastLine - firstLine) / 3;
  const lines = [0, 1, 2, 3].map((index) => firstLine + lineStep * index);
  const labels = [
    { x: lines[0] - 10, text: "Personal page" },
    { x: lines[1] - 10, text: "Poland, Poznan" },
  ];

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[-59px] z-20 hidden h-[787px] lg:block" aria-hidden="true">
      {lines.map((x) => (
        <span
          key={x}
          className="absolute top-0 h-full w-px bg-gradient-to-b from-white/20 via-white/20 to-transparent"
          style={{ left: `${x}px` }}
        />
      ))}
      {labels.map((label) => (
        <div
          key={label.text}
          className="absolute top-[236px] flex h-[25px] items-center gap-[22px] font-jakarta text-[13px] uppercase leading-[25px] text-white/40"
          style={{ left: `${label.x}px` }}
        >
          <span className="relative block h-[20px] w-[20px] shrink-0">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white" />
          </span>
          <span>{label.text}</span>
        </div>
      ))}
    </div>
  );
}

function PlusMarker({ className = "" }) {
  return (
    <span className={`relative block h-[20px] w-[20px] shrink-0 ${className}`} aria-hidden="true">
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white" />
    </span>
  );
}

function HeroTopBrief() {
  const firstLine = 10;
  const lastLine = 1390;
  const thirdLine = firstLine + ((lastLine - firstLine) / 3) * 2;

  return (
    <div
      className="pointer-events-auto absolute top-[178px] z-30 hidden w-[390px] items-start gap-[11px] lg:flex"
      style={{ left: `${thirdLine - 10}px` }}
    >
      <PlusMarker />
      <div className="mt-[-4px] flex min-w-0 flex-1 flex-col items-start gap-[26px] pr-8">
        <MonoText italic className="w-full !text-[20px] font-normal !leading-[33px] md:!text-[20px] md:!leading-[33px]">
          Digital design beyond trends — built to be clear, logical, and easy to launch.
        </MonoText>
        <Button />
      </div>
    </div>
  );
}

function ResponsiveViewportGuide() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[-220px] z-20 h-[1054px] min-[500px]:top-[-140px] min-[500px]:h-[1072px] lg:hidden" aria-hidden="true">
      <span className="absolute left-[10px] top-0 h-full w-px bg-gradient-to-b from-white/25 via-white/25 to-transparent" />
      <span className="absolute right-[10px] top-0 h-full w-px bg-gradient-to-b from-white/25 via-white/25 to-transparent" />
    </div>
  );
}

function ResponsiveIntro() {
  return (
    <section className="relative mt-[59px] mb-[72px] h-[920px] w-full min-[500px]:mt-0 min-[500px]:h-[1029px] min-[500px]:w-[775px] lg:hidden">
      <div className="absolute left-0 top-[7px] z-20 flex w-[390px] max-w-none items-start gap-[11px] min-[500px]:top-[112px]">
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
          className="pointer-events-none absolute left-0 top-[104px] h-[407px] w-[750px] max-w-none object-cover opacity-100 blur-[6px] min-[500px]:left-0 min-[500px]:top-[-22px] min-[500px]:h-[608px] min-[500px]:w-[1120px]"
        />
        <div className="absolute left-0 top-[280px] z-10 w-full min-[500px]:top-[365px]">
          <h1 className="mb-[-16px] w-fit whitespace-nowrap font-buffon text-[84px] font-normal uppercase leading-[85px] text-white min-[500px]:leading-[122px] min-[500px]:text-[132px]">
            Hello!
          </h1>
          <h2 className="w-fit whitespace-nowrap font-display text-[78px] font-light uppercase leading-[84px] tracking-[-3.12px] text-white min-[500px]:ml-[196px] min-[500px]:text-[126px] min-[500px]:leading-[136px] min-[500px]:tracking-[-5.04px]">
            Iam ANNa
          </h2>
        </div>
      </div>

      <div className="absolute left-0 top-[526px] flex w-full flex-col items-start min-[500px]:top-[647px]">
        <div className="flex w-full flex-col gap-6 pb-1 pt-2 min-[500px]:relative min-[500px]:h-[140px] min-[500px]:gap-0 min-[500px]:pb-0 min-[500px]:pt-0">
          <MonoText className="ml-[104px] w-full max-w-[296px] font-normal min-[500px]:absolute min-[500px]:left-[416px] min-[500px]:top-[30.5px] min-[500px]:ml-0 min-[500px]:w-[327px] min-[500px]:max-w-none">
            Shaping clear visual interfaces for thoughtful digital products and the people who use them.
          </MonoText>
          <h2 className="font-display text-[78px] font-light uppercase leading-[84px] tracking-[-3.12px] text-white min-[500px]:absolute min-[500px]:left-0 min-[500px]:top-0 min-[500px]:w-fit min-[500px]:whitespace-nowrap min-[500px]:text-[126px] min-[500px]:leading-[136px] min-[500px]:tracking-[-5.04px]">
            UX/UI
          </h2>
        </div>
        <div className="flex w-full flex-col items-start text-white min-[500px]:relative min-[500px]:h-[242px]">
          <h2 className="mb-[-16px] font-buffon text-[84px] font-normal uppercase leading-[85px] text-white min-[500px]:mb-0 min-[500px]:h-[122px] min-[500px]:w-full min-[500px]:text-[132px] min-[500px]:leading-[122px]">
            Product
          </h2>
          <h2 className="font-display text-[78px] font-light uppercase leading-[84px] tracking-[-3.12px] text-white min-[500px]:absolute min-[500px]:left-[189px] min-[500px]:top-[106px] min-[500px]:w-fit min-[500px]:whitespace-nowrap min-[500px]:text-[126px] min-[500px]:leading-[136px] min-[500px]:tracking-[-5.04px]">
            Designer
          </h2>
          <div className="flex flex-col pt-4 font-jakarta text-base font-normal uppercase leading-[25px] text-white min-[500px]:absolute min-[500px]:left-0 min-[500px]:top-[106px] min-[500px]:pt-4">
            <span data-gl-text className="inline-block whitespace-nowrap">/ Web</span>
            <span data-gl-text className="inline-block whitespace-nowrap">/ Graphic</span>
            <span data-gl-text className="inline-block whitespace-nowrap">/ identity</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundGlow() {
  return (
    <img
      src={heroBackground}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute left-[17%] top-[-64px] z-0 h-[420px] w-[780px] max-w-none object-cover opacity-100 blur-[6px] md:left-[18%] md:top-[-86px] md:h-[560px] md:w-[980px] lg:left-[302px] lg:top-[50px] lg:h-[608px] lg:w-[1120px]"
    />
  );
}

function Hero() {
  return (
    <header className="relative hidden h-[748px] w-full flex-col gap-2 overflow-visible pb-0 pt-[354px] lg:flex">
      <BackgroundGlow />
      <div className="relative z-10 flex w-full items-center">
        <Display as="h1" buffon>
          Hello!
        </Display>
      </div>
      <div className="relative z-10 flex w-full items-end lg:pl-[287px]">
        <Display as="h2" className="text-right lg:tracking-[-6.72px]">
          Iam ANNa
        </Display>
      </div>
    </header>
  );
}

function ProductIntro() {
  return (
    <section className="hidden h-[592px] w-full flex-col items-start py-[72px] lg:flex">
      <div className="flex h-[158px] w-full flex-col gap-10 pb-1 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <Display className="lg:tracking-[-6.72px]">UX/UI</Display>
        <div className="flex w-[286px] max-w-full flex-col items-start gap-[42px] lg:h-[75px] lg:w-[359px] lg:gap-0 lg:pr-8">
          <MonoText className="w-full max-w-[327px] font-normal">
            Shaping clear visual interfaces for thoughtful digital products and the people who use them.
          </MonoText>
        </div>
      </div>
      <div className="flex w-full flex-col items-start text-white">
        <Display buffon className="lg:mb-[-24px]">
          Product
        </Display>
        <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-start lg:gap-[194px]">
          <div className="order-2 flex flex-row gap-4 pt-0 font-jakarta text-base font-normal uppercase leading-[25px] text-white lg:order-1 lg:flex-col lg:gap-0 lg:pt-4">
            <span data-gl-text className="inline-block whitespace-nowrap">/ Web</span>
            <span data-gl-text className="inline-block whitespace-nowrap">/ Graphic</span>
            <span data-gl-text className="inline-block whitespace-nowrap">/ identity</span>
          </div>
          <Display className="order-1 lg:order-2 lg:tracking-[-6.72px]">Designer</Display>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="relative ml-auto flex w-full max-w-[1202px] flex-col gap-12 max-[499px]:mt-[6px] max-[499px]:h-[833px] min-[500px]:max-lg:mt-[9px] min-[500px]:max-lg:h-[833px] min-[500px]:max-lg:w-[775px] lg:mt-0 lg:h-[815px]">
      <div
        data-gl-media
        className="absolute right-0 top-[40px] hidden h-[200px] w-[200px] overflow-hidden bg-white max-[499px]:block min-[500px]:max-lg:right-0 min-[500px]:max-lg:top-[40px] min-[500px]:max-lg:block min-[500px]:max-lg:h-[239px] min-[500px]:max-lg:w-[239px]"
      >
        <img src={aboutPortrait} alt="Anna Loban portrait" className="h-full w-full object-cover" />
      </div>
      <div className="flex w-full gap-[21px] max-[499px]:absolute max-[499px]:left-0 max-[499px]:top-[184px] max-[499px]:w-[402px] max-[499px]:gap-4 min-[500px]:max-lg:absolute min-[500px]:max-lg:left-0 min-[500px]:max-lg:top-[208px] min-[500px]:max-lg:w-[775px] min-[500px]:max-lg:gap-4 lg:absolute lg:left-[181px] lg:top-[240px] lg:w-[1021px] lg:gap-4">
        <div className="relative mt-[6px] block h-[31px] w-[28px] shrink-0 max-[499px]:mt-0 min-[500px]:max-lg:mt-0 min-[500px]:max-lg:w-[84px] lg:mt-0 lg:w-[84px]">
          <img src={quoteIcon} alt="" className="h-[25px] w-[28px] max-[499px]:mt-[6px] min-[500px]:max-lg:absolute min-[500px]:max-lg:left-[49px] min-[500px]:max-lg:top-[6px] min-[500px]:max-lg:mt-0 lg:absolute lg:left-[49px] lg:top-[6px] lg:mt-0" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[88px] max-[499px]:w-[358px] max-[499px]:flex-none max-[499px]:gap-[91px] min-[500px]:max-lg:gap-[91px] lg:gap-[91px]">
          <div className="font-jakarta text-[18px] font-normal uppercase leading-[29px] text-white max-[499px]:text-[20px] max-[499px]:leading-[32px] min-[500px]:max-lg:!text-[26px] min-[500px]:max-lg:!leading-[41px] md:text-[32px] md:leading-[49px] lg:text-[26px] lg:leading-[41px]">
            <div
              data-gl-media
              className="float-right mb-2 ml-5 mt-[-120px] h-[180px] w-[180px] overflow-hidden bg-white max-[499px]:hidden min-[500px]:ml-7 min-[500px]:mt-[-198px] min-[500px]:h-[264px] min-[500px]:w-[264px] min-[500px]:max-lg:hidden md:mt-[-210px] md:h-[300px] md:w-[300px] lg:mb-0 lg:ml-6 lg:mr-[28px] lg:mt-[-174px] lg:h-[239px] lg:w-[239px]"
            >
              <img src={aboutPortrait} alt="Anna Loban portrait" className="h-full w-full object-cover" />
            </div>
            <span>About . </span>
            <span className="text-white/60">
              I am a <br className="hidden max-[499px]:block" />
              senior UX/UI <br className="hidden max-[499px]:block min-[500px]:max-lg:block" />
              designer. Strong product <br className="hidden max-[499px]:block min-[500px]:max-lg:block" />
              structure and refined visuals go hand in hand. Working
              independently, I create design systems that move business forward and save development time.{" "}
            </span>
            <span>The result: no chaotic iterations — just constructive decisions that make sense.</span>
          </div>
          <div className="flex w-[286px] max-w-full flex-col gap-[42px] max-[499px]:h-[165px] max-[499px]:w-[353px] max-[499px]:pr-6 min-[500px]:max-lg:h-[165px] min-[500px]:max-lg:w-[353px] min-[500px]:max-lg:pr-6 lg:w-[359px] lg:pr-6">
            <MonoText className="font-normal">Combining real human behavior, clear product logic, and strong visual appeal.</MonoText>
            <Button />
          </div>
        </div>
      </div>
    </section>
  );
}

function Purpose() {
  return (
    <>
    <section className="relative hidden h-[1319px] w-[775px] min-[500px]:max-lg:block lg:hidden">
      <div className="absolute left-0 top-[40px] h-[405px] w-full">
        <h2
          data-gl-text
          className="absolute left-0 top-0 w-[437px] whitespace-nowrap text-right font-display text-[126px] font-light uppercase leading-[136px] tracking-[-5.04px] text-white"
        >
          digital
        </h2>
        <MonoText className="absolute left-[511px] top-2 h-[75px] w-[264px] font-normal !text-base !leading-[25px]">
          A web/UI designer crafting intuitive and engaging digital experiences
        </MonoText>
        <h2
          data-gl-text
          className="absolute left-0 top-[136px] w-full whitespace-nowrap text-center font-display text-[126px] font-light uppercase leading-[136px] tracking-[-5.04px] text-white"
        >
          design with
        </h2>
        <h2 className="absolute left-0 top-[283px] w-[544px] whitespace-nowrap font-buffon text-[132px] font-normal uppercase leading-[122px] text-white">
          purpose
        </h2>
      </div>

      <div className="absolute left-0 top-[445px] h-[834px] w-full">
        <div className="absolute left-0 top-16 flex w-[362px] flex-col gap-10 pt-[280px]">
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

        <div className="absolute left-[524px] top-16 flex h-[361px] w-[251px] flex-col items-start gap-4">
          <MonoText className="w-[251px] font-normal">
            Delivering tailored solutions for my clients
          </MonoText>
          <div className="flex w-[251px] flex-col gap-[42px]">
            <div data-gl-background className="flex w-full flex-col overflow-hidden border-b border-white">
              {services.map((service, index) => (
                <div data-gl-background className={`flex h-[41px] items-center ${index === 0 ? "border-t border-white" : "border-t border-white"}`} key={service}>
                  <MonoText className="whitespace-nowrap font-normal">{service}</MonoText>
                </div>
              ))}
            </div>
            <Button />
          </div>
        </div>
      </div>
    </section>

    <section className="flex w-full flex-col items-end pt-[96px] max-[499px]:mt-0 max-[499px]:h-[1304px] max-[499px]:py-[40px] min-[500px]:max-lg:hidden lg:mt-0 lg:h-[1403px] lg:py-[72px]">
      <div className="flex w-full flex-col items-start">
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-28">
          <Display className="hidden lg:block lg:tracking-[-6.72px]">digital</Display>
          <MonoText className="order-first mt-2 w-[296px] max-w-full self-start font-normal !text-base !leading-[25px] max-[499px]:ml-[136px] max-[499px]:w-[264px] max-[499px]:max-w-none lg:order-none lg:mt-0 lg:w-[264px] lg:pt-2 lg:!text-base lg:!leading-[25px]">
            A web/UI designer crafting intuitive and engaging digital experiences
          </MonoText>
        </div>
        <div className="mt-6 flex w-full items-center lg:mt-0 lg:px-[270px]">
          <h2 className="font-display text-[78px] font-light uppercase leading-[84px] tracking-[-3.12px] text-white lg:hidden">
            design
            <br />
            with
          </h2>
          <Display className="hidden lg:block lg:tracking-[-6.72px]">design with</Display>
        </div>
        <div className="flex w-full items-end lg:pl-[178px]">
          <Display buffon className="!text-[84px] !leading-[85px] lg:!text-[175px] lg:!leading-[180.7px] lg:tracking-[3.5px]">
            purpose
          </Display>
        </div>
      </div>

      <div className="mt-16 flex w-full flex-col gap-[72px] lg:mt-0 lg:flex-row lg:items-start lg:justify-between lg:gap-20 lg:pl-[376px]">
        <div className="flex w-full flex-col gap-[24px] lg:w-[362px] lg:gap-10 lg:pt-[280px]">
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

        <div className="flex w-full flex-col gap-4 lg:h-[361px] lg:w-[359px] lg:pr-[108px]">
          <MonoText className="w-full max-w-full font-normal lg:w-[251px]">
            Delivering tailored solutions for my <br className="hidden max-[499px]:block" /> clients
          </MonoText>
          <div className="flex w-full flex-col gap-[42px] lg:w-[251px] lg:max-w-full">
            <div data-gl-background className="flex w-full flex-col overflow-hidden border-y border-white">
              {services.map((service, index) => (
                <div data-gl-background className={`flex h-[41px] items-center lg:h-[42px] ${index === 0 ? "" : "border-t border-white"}`} key={service}>
                  <MonoText className="whitespace-nowrap font-normal">{service}</MonoText>
                </div>
              ))}
            </div>
            <Button />
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

function WorksHeading() {
  return (
    <section className="mt-0 flex w-full flex-col gap-2 max-[499px]:h-[353px] max-[499px]:pt-[40px] min-[500px]:max-lg:h-[346px] min-[500px]:max-lg:py-[40px] lg:mt-0 lg:h-[487px] lg:py-[72px]">
      <div className="flex h-[180px] w-full flex-col items-start gap-0 min-[500px]:h-[136px] min-[500px]:flex-row min-[500px]:items-center min-[500px]:justify-between lg:h-[154px] lg:gap-8">
        <Display className="!text-[78px] !leading-[96px] !tracking-[-3.12px] min-[500px]:max-lg:!text-[126px] min-[500px]:max-lg:!leading-[136px] min-[500px]:max-lg:!tracking-[-5.04px] lg:!text-[168px] lg:!leading-[154px] lg:tracking-[-6.72px]">some</Display>
        <Display className="!text-[78px] !leading-[84px] !tracking-[-3.12px] min-[500px]:max-lg:!text-[126px] min-[500px]:max-lg:!leading-[136px] min-[500px]:max-lg:!tracking-[-5.04px] lg:!text-[168px] lg:!leading-[154px] lg:tracking-[-6.72px]">of my</Display>
      </div>
      <div className="flex w-full items-center pl-0 lg:pl-[188px]">
        <Display buffon className="w-[1338px] !text-[84px] !leading-[85px] min-[500px]:max-lg:!w-full min-[500px]:max-lg:!text-[132px] min-[500px]:max-lg:!leading-[122px] lg:!text-[175px] lg:!leading-[180.7px] lg:tracking-[1.75px]">
          works
        </Display>
      </div>
    </section>
  );
}

function ProjectCard({ work, className = "" }) {
  return (
    <article className={`flex w-full max-w-full flex-col gap-3 lg:w-[368px] ${className}`}>
      <p data-gl-text className="font-jakarta text-[13px] font-normal uppercase leading-[25px] text-white/40">
        {work.kind}
      </p>
      <div data-gl-media className="relative h-[480px] w-full overflow-hidden bg-white lg:h-[480px]">
        <img src={work.image} alt="" className="h-full w-full object-cover" />
      </div>
      <div
        data-gl-background
        className="flex w-full items-start justify-between gap-4 border-b border-white pb-3 font-mono text-base uppercase leading-[25px] text-white min-[500px]:max-lg:pb-[11px]"
      >
        <span data-gl-text className="min-w-0 whitespace-nowrap">
          {work.name}
        </span>
        <a data-gl-text href={work.href} target="_blank" rel="noreferrer" className="shrink-0 underline">
          Live
        </a>
      </div>
    </article>
  );
}

function Works() {
  return (
    <section className="mt-0 flex w-full flex-col gap-[92px] px-4 py-[40px] min-[500px]:max-lg:w-[775px] min-[500px]:max-lg:px-0 min-[500px]:max-lg:py-[40px] lg:mt-0 lg:gap-0 lg:px-0 lg:py-0">
      <div className="flex w-full flex-col gap-[72px] min-[500px]:max-lg:gap-[72px] lg:gap-0">
        <div className="flex w-full flex-col items-start gap-[72px] lg:h-[710px] lg:flex-row lg:justify-between lg:gap-0 lg:py-[72px]">
          <div className="flex w-full flex-col gap-[72px] min-[500px]:max-lg:gap-[72px] lg:w-auto lg:flex-row lg:gap-[113px]">
            <ProjectCard work={works[0]} className="min-[500px]:max-lg:ml-[407px] min-[500px]:max-lg:w-[368px]" />
            <ProjectCard work={works[1]} className="min-[500px]:max-lg:w-[368px]" />
          </div>
          <MonoText className="hidden w-[257px] font-normal lg:block">Users always compare options.</MonoText>
        </div>
        <div className="hidden w-full flex-col items-start gap-[72px] lg:flex lg:h-[710px] lg:flex-row lg:justify-between lg:gap-0 lg:py-[72px]">
          <MonoText className="hidden w-[271px] font-normal lg:block">The context changes with the audience.</MonoText>
          <div className="flex w-full flex-col gap-[72px] lg:w-auto lg:flex-row lg:gap-28">
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
    <section className="relative mt-0 flex w-full flex-col max-[499px]:h-[1162px] max-[499px]:pt-[40px] min-[500px]:max-lg:h-[1230px] min-[500px]:max-lg:w-[775px] min-[500px]:max-lg:pt-[40px] lg:mt-0 lg:h-[874px] lg:pt-[72px]">
      <div className="flex w-full items-start justify-between">
        <p data-gl-text className="font-jakarta text-[13px] font-normal uppercase leading-[25px] text-white/40">
          Start a project
        </p>
        <p className="w-[288px] font-jakarta text-base font-normal uppercase leading-[25px] text-right text-white lg:w-[180px] lg:font-mono">
          Open for a few
          <br />
          selected projects
        </p>
      </div>

      <h2 className="mt-[32px] font-display text-[32px] font-light uppercase leading-[48px] tracking-[-2.24px] text-white md:text-[54px] md:leading-[62px] md:tracking-[-0.5px] min-[500px]:max-lg:!mt-[40px] min-[500px]:max-lg:!text-[56px] min-[500px]:max-lg:!leading-[74px] min-[500px]:max-lg:!tracking-[-3.92px] lg:mt-[40px] lg:text-[96px] lg:leading-[106px] lg:tracking-[-6.72px]">
        Let`s create something
        <br />
        <span className="text-white/35">amazing</span> together
      </h2>

      <div className="mt-[32px] grid w-full grid-cols-1 gap-[40px] pt-6 md:grid-cols-[300px_minmax(0,1fr)] md:gap-10 min-[500px]:max-lg:!mt-[40px] min-[500px]:max-lg:flex min-[500px]:max-lg:h-[912px] min-[500px]:max-lg:flex-col min-[500px]:max-lg:gap-[40px] min-[500px]:max-lg:px-0 min-[500px]:max-lg:py-6 lg:mt-[40px] lg:h-[460px] lg:grid-cols-[496px_minmax(0,1fr)] lg:gap-[40px] lg:p-6">
        <div data-gl-media className="relative order-2 h-[412px] w-[496px] max-w-full overflow-hidden md:order-1 md:h-[300px] md:w-[300px] min-[500px]:max-lg:!order-2 min-[500px]:max-lg:!h-[412px] min-[500px]:max-lg:!w-full lg:h-[412px] lg:w-[496px]">
          <img
            src={footerFormImage}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover min-[500px]:max-lg:ml-[-11px] min-[500px]:max-lg:mt-[-10px] min-[500px]:max-lg:h-[432px] min-[500px]:max-lg:w-[749px] min-[500px]:max-lg:max-w-none"
          />
        </div>

        <form action={briefHref} className="order-1 flex min-w-0 flex-col gap-[24px] max-[499px]:gap-[32px] md:order-2 min-[500px]:max-lg:!order-1 min-[500px]:max-lg:!h-[412px] min-[500px]:max-lg:!w-full min-[500px]:max-lg:!gap-[32px] lg:gap-[32px]" aria-label="Project request form" noValidate onSubmit={submitFooterForm}>
          <div className="flex w-full flex-col gap-[24px]">
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
            <div className="grid min-w-0 w-full grid-cols-2 gap-3 md:grid-cols-1 md:gap-6 min-[500px]:max-lg:!grid-cols-2 min-[500px]:max-lg:!gap-3 lg:grid-cols-2 lg:gap-3">
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
            className="flex h-12 w-full items-center justify-center border-b border-black bg-white px-10 font-jakarta text-base font-bold uppercase leading-[25px] text-black"
            type="submit"
          >
            <span className="block whitespace-nowrap leading-[25px]">Start a project</span>
          </button>
        </form>
      </div>
    </section>
  );
}

function LoopStart() {
  return (
    <section className="pointer-events-none relative hidden h-screen w-full overflow-clip lg:block" aria-hidden="true">
      <div className="absolute left-0 top-0 flex w-full flex-col gap-[154px]">
        <Hero />
      </div>
    </section>
  );
}

export default function App() {
  const reduced = useReducedMotion();
  const page = useMemo(
    () => (
      <>
        <SectionShell className="z-50">
          <TopLinks />
        </SectionShell>
        <SectionShell
          decor={
            <>
              <FirstViewportGuide />
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
      <main className="relative z-10 flex min-h-screen flex-col gap-0 overflow-hidden pb-5 pt-[49px] lg:gap-0 lg:pb-[40px] lg:pt-[32px]" aria-label="Anna Loban portfolio">
        <div className="relative z-10 flex flex-col gap-0">
          {page}
        </div>
      </main>
    </>
  );
}
