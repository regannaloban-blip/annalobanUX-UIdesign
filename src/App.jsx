import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { CanvasScene } from "./webgl/CanvasScene.js";

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
      <span className="block whitespace-nowrap font-jakarta text-base font-bold uppercase leading-none">
        start a project
      </span>
    </a>
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
    <label className={`flex min-w-0 flex-col gap-1 ${className}`}>
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
        placeholder={placeholder}
        required={required}
        type={as === "input" ? type : undefined}
        value={value}
      />
      {error && (
        <span className="flex items-center gap-1 font-jakarta text-[14px] font-semibold normal-case leading-5 text-white">
          <span className="h-1 w-1 rounded-full bg-white" />
          {error}
        </span>
      )}
    </label>
  );
}

function Display({ as: Tag = "h2", children, className = "", buffon = false }) {
  const fontClass = buffon ? "font-buffon font-normal" : "font-display font-light";
  const sizeClass = buffon
    ? "text-[72px] leading-[62px] md:text-[118px] md:leading-[110px] lg:text-[175px] lg:leading-[160px]"
    : "text-[56px] leading-[58px] md:text-[96px] md:leading-[94px] lg:text-[168px] lg:leading-[154px] lg:tracking-[-7px]";

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
    <nav className="relative z-40 flex w-full flex-wrap items-start justify-between gap-x-6 gap-y-2 font-jakarta text-[12px] uppercase leading-[18px] text-white min-[390px]:text-sm sm:text-base sm:leading-[25px] lg:justify-end lg:gap-[40px]">
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
  const firstLine = 59;
  const lastLine = 1271;
  const lineStep = (lastLine - firstLine) / 3;
  const lines = [0, 1, 2, 3].map((index) => firstLine + lineStep * index);
  const labels = [
    { x: lines[0] - 10, text: "Personal page" },
    { x: lines[1] - 10, text: "Poland, Poznan" },
  ];

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden h-[789px] lg:block" aria-hidden="true">
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
          className="absolute top-[204px] flex h-[25px] items-center gap-[22px] font-jakarta text-[13px] uppercase leading-[25px] text-white/40"
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

function PlusMarker() {
  return (
    <span className="relative block h-[20px] w-[20px] shrink-0" aria-hidden="true">
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white" />
    </span>
  );
}

function HeroTopBrief() {
  const firstLine = 59;
  const lastLine = 1271;
  const thirdLine = firstLine + ((lastLine - firstLine) / 3) * 2;

  return (
    <div
      className="absolute top-[206px] z-30 hidden w-[458px] items-start gap-[11px] lg:flex"
      style={{ left: `${thirdLine - 10}px` }}
    >
      <PlusMarker />
      <div className="mt-[-4px] flex min-w-0 flex-1 flex-col items-start gap-[26px] pr-8">
        <MonoText italic className="w-full max-w-[360px] !text-[20px] font-normal !leading-[31px] md:!text-[20px] md:!leading-[31px]">
          Digital design beyond trends — built to be clear, logical, and easy to launch.
        </MonoText>
        <Button />
      </div>
    </div>
  );
}

function BackgroundGlow() {
  return (
    <img
      src={heroBackground}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute left-[17%] top-[-64px] z-0 h-[420px] w-[780px] max-w-none object-cover opacity-100 blur-[6px] md:left-[18%] md:top-[-86px] md:h-[560px] md:w-[980px] lg:left-[277px] lg:top-[-102px] lg:h-[605px] lg:w-[1114px]"
    />
  );
}

function Hero() {
  return (
    <header className="relative -mx-5 flex w-[calc(100%+40px)] flex-col gap-2 overflow-hidden px-5 pb-16 pt-36 md:-mx-9 md:w-[calc(100%+72px)] md:px-9 md:pt-44 lg:mx-0 lg:w-full lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-[192px]">
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
    <section className="flex w-full flex-col items-start">
      <div className="flex w-full flex-col gap-10 pb-1 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <Display className="lg:tracking-[-6.72px]">UX/UI</Display>
        <div className="flex w-[286px] max-w-full flex-col items-start gap-[42px] lg:w-[359px] lg:pr-8">
          <MonoText>
            Shaping clear visual interfaces for thoughtful digital products and the people who use them.
          </MonoText>
          <Button />
        </div>
      </div>
      <div className="flex w-full flex-col items-start text-white">
        <Display buffon className="lg:mb-[-24px]">
          Product
        </Display>
        <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-start lg:gap-[194px]">
          <div className="order-2 flex flex-row gap-4 pt-0 font-jakarta text-base font-light uppercase leading-[25px] text-white lg:order-1 lg:flex-col lg:gap-0 lg:pt-4">
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
    <section className="relative ml-auto flex w-full max-w-[1202px] flex-col gap-12 lg:h-[737px]">
      <div className="flex w-full gap-10 lg:absolute lg:left-[181px] lg:top-[205px] lg:w-[1021px] lg:gap-4">
        <div className="relative mt-1 hidden shrink-0 lg:block lg:mt-0 lg:h-[31px] lg:w-[84px]">
          <img src={quoteIcon} alt="" className="h-full w-full lg:absolute lg:left-[49px] lg:top-[6px] lg:h-[25px] lg:w-[28px]" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[88px] lg:w-[790px] lg:flex-none lg:gap-[91px]">
          <div className="font-jakarta text-[18px] font-normal uppercase leading-[29px] text-white md:text-[32px] md:leading-[49px] lg:text-[26px] lg:leading-[41px]">
            <div
              data-gl-media
              className="float-right mb-4 ml-4 h-[104px] w-[104px] overflow-hidden bg-white min-[390px]:h-[132px] min-[390px]:w-[132px] md:h-[220px] md:w-[220px] lg:mb-0 lg:ml-6 lg:mt-[-174px] lg:h-[239px] lg:w-[239px]"
            >
              <img src={aboutPortrait} alt="Anna Loban portrait" className="h-full w-full object-cover" />
            </div>
            <span>About . </span>
            <span className="text-white/60">
              I am a senior UX/UI designer. Strong product structure and refined visuals go hand in hand. Working
              independently, I create design systems that move business forward and save development time.{" "}
            </span>
            <span>The result: no chaotic iterations — just constructive decisions that make sense.</span>
          </div>
          <div className="flex w-[286px] max-w-full flex-col gap-[42px] lg:w-[359px] lg:pr-6">
            <MonoText>Combining real human behavior, clear product logic, and strong visual appeal.</MonoText>
            <Button />
          </div>
        </div>
      </div>
    </section>
  );
}

function Purpose() {
  return (
    <section className="flex w-full flex-col items-end">
      <div className="flex w-full flex-col items-start">
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-28">
          <Display className="lg:tracking-[-6.72px]">digital</Display>
          <MonoText className="w-[264px] pt-2">
            A web/UI designer crafting intuitive and engaging digital experiences
          </MonoText>
        </div>
        <div className="flex w-full items-center lg:px-[270px]">
          <Display className="lg:tracking-[-6.72px]">design with</Display>
        </div>
        <div className="flex w-full items-end lg:pl-[178px]">
          <Display buffon className="lg:tracking-[3.5px]">
            purpose
          </Display>
        </div>
      </div>

      <div className="mt-16 flex w-full flex-col gap-20 lg:mt-0 lg:flex-row lg:items-start lg:justify-between lg:pl-[376px]">
        <div className="flex w-full flex-col gap-10 lg:w-[362px] lg:pt-[280px]">
          {advantageCards.map((card) => (
            <div className="flex gap-8" key={card.number}>
              <MonoText bold className="shrink-0 whitespace-nowrap">
                {card.number}
              </MonoText>
              <div className="flex flex-1 flex-col gap-5">
                <MonoText bold>{card.title}</MonoText>
                <MonoText>{card.text}</MonoText>
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col gap-4 lg:h-[361px] lg:w-[359px] lg:pr-[108px]">
          <MonoText className="w-[251px] max-w-full">Delivering tailored solutions for my clients</MonoText>
          <div className="flex w-[251px] max-w-full flex-col gap-[42px]">
            <div data-gl-background className="flex w-full flex-col overflow-hidden border-b border-white">
              {services.map((service, index) => (
                <div data-gl-background className={`flex h-[42px] items-center ${index === 0 ? "" : "border-t border-white"}`} key={service}>
                  <MonoText className="whitespace-nowrap">{service}</MonoText>
                </div>
              ))}
            </div>
            <Button />
          </div>
        </div>
      </div>
    </section>
  );
}

function WorksHeading() {
  return (
    <section className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between gap-8">
        <Display className="lg:tracking-[-6.72px]">some</Display>
        <Display className="lg:tracking-[-6.72px]">of my</Display>
      </div>
      <div className="flex w-full items-center pl-10 lg:pl-[188px]">
        <Display buffon className="w-[1338px] lg:tracking-[1.75px]">
          works
        </Display>
      </div>
    </section>
  );
}

function ProjectCard({ work }) {
  return (
    <article className="flex w-[321px] max-w-full flex-col gap-3 md:w-[411px] lg:w-[458px]">
      <p data-gl-text className="font-jakarta text-[13px] font-normal uppercase leading-[25px] text-white/40">
        {work.kind}
      </p>
      <div data-gl-media className="relative h-[380px] w-full overflow-hidden bg-white md:h-[542px]">
        <img src={work.image} alt="" className="h-full w-full object-cover" />
      </div>
      <div
        data-gl-background
        className="flex w-full items-start justify-between gap-4 border-b border-white pb-3 font-mono text-base uppercase leading-[25px] text-white"
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
    <section className="flex w-full flex-col gap-[154px] pb-24 lg:pb-0">
      <div className="flex w-full flex-col gap-16 lg:gap-[154px]">
        <div className="flex w-full flex-col items-start gap-12 lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-[113px]">
            <ProjectCard work={works[0]} />
            <ProjectCard work={works[1]} />
          </div>
          <MonoText className="w-[257px]">Users always compare options.</MonoText>
        </div>
        <div className="flex w-full flex-col items-start gap-12 lg:h-[628px] lg:flex-row lg:justify-between">
          <MonoText className="w-[271px]">The context changes with the audience.</MonoText>
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-28">
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
    const { name } = event.target;
    setFormTouched((current) => ({ ...current, [name]: true }));
  };
  const submitFooterForm = (event) => {
    setFormSubmitted(true);

    if (Object.keys(formErrors).length > 0) {
      event.preventDefault();
    }
  };

  return (
    <section className="relative flex h-[806px] w-full flex-col">
      <div className="flex w-full items-start justify-between">
        <p data-gl-text className="font-jakarta text-[13px] font-normal uppercase leading-[25px] text-white/40">
          Start a project
        </p>
        <MonoText className="w-[180px] text-right">
          Open for a few
          <br />
          selected projects
        </MonoText>
      </div>

      <h2 className="mt-[42px] font-display text-[62px] font-light uppercase leading-[68px] tracking-[-2px] text-white md:text-[96px] md:leading-[106px] lg:text-[96px] lg:leading-[106px] lg:tracking-[-6.72px]">
        Let`s create something
        <br />
        <span className="text-white/35">amazing</span> together
      </h2>

      <div className="mt-[42px] grid w-full grid-cols-1 gap-12 lg:h-[460px] lg:grid-cols-[496px_minmax(0,1fr)] lg:gap-[40px] lg:p-6">
        <div data-gl-media className="relative h-[412px] w-[496px] max-w-full overflow-hidden">
          <img
            src={footerFormImage}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </div>

        <form action={briefHref} className="flex min-w-0 flex-col gap-[32px]" aria-label="Project request form" noValidate onSubmit={submitFooterForm}>
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
            <div className="grid min-w-0 w-full grid-cols-1 gap-3 md:grid-cols-2">
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
            className="flex h-12 w-full items-center justify-center border-b border-black bg-white px-10 pb-[6px] pt-0 font-jakarta text-base font-bold uppercase leading-[25px] text-black"
            type="submit"
          >
            Start a project
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

function WebGLCanvasLayer({ reduced }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (reduced || !canvasRef.current) return undefined;

    const scene = new CanvasScene({
      canvas: canvasRef.current,
      enableSmoothScroll: false,
      onReady: () => document.body.classList.add("gl-ready"),
      onFallback: () => document.body.classList.remove("gl-ready"),
    });

    return () => {
      scene.destroy();
      document.body.classList.remove("gl-ready");
    };
  }, [reduced]);

  if (reduced) return null;
  return <canvas ref={canvasRef} className="webgl-layer" aria-hidden="true" />;
}

export default function App() {
  const reduced = useReducedMotion();
  const page = useMemo(
    () => (
      <>
        <TopLinks />
        <Hero />
        <ProductIntro />
        <About />
        <Purpose />
        <WorksHeading />
        <Works />
        <Footer />
      </>
    ),
    [],
  );

  return (
    <>
      <Preloader reduced={reduced} />
      <WebGLCanvasLayer reduced={reduced} />
      <main className="relative z-10 flex min-h-screen flex-col gap-[114px] overflow-hidden px-5 py-5 md:px-9 md:py-9 lg:gap-[154px] lg:px-[49px] lg:py-[35px]" aria-label="Anna Loban portfolio">
        <FirstViewportGuide />
        <HeroTopBrief />
        <div className="relative z-10 flex flex-col gap-[114px] lg:gap-[154px]">
          {page}
        </div>
      </main>
    </>
  );
}
