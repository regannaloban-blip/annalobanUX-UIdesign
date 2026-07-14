import React, { useEffect, useMemo, useRef, useState } from "react";
import { CanvasScene } from "./webgl/CanvasScene.js";
import { Button, Display, MonoText, briefHref, contactFormId } from "./components/PortfolioPrimitives.jsx";
import { TopLinks } from "./components/TopLinks.jsx";
import { Hero, HeroFirstScreen, ResponsiveViewportGuide, StableHeroCtaOverlay, StableHeroGridOverlay } from "./sections/Hero.jsx";

import aboutPortrait from "../assets/ai-portfolio/figma/anna-redesign/about.png";
import project1 from "../Case/Compressed/24 colab.jpg";
import project2 from "../Case/Compressed/smart business intelligence.jpg";
import project3 from "../Case/Compressed/Skyliner.jpg";
import project4 from "../Case/Compressed/your dissertation.jpg";
import quoteIcon from "../assets/ai-portfolio/figma/anna-redesign/quote-icon.svg";
import footerFormImage from "../Case/Compressed/contact.jpg";
import contactLiquidVideo from "../Case/Compressed/contact-smoke-red.mp4";

const formSubmitHref = "https://anna-contact-form-v2.ann-loban.workers.dev";
const canvasSceneKey = "__annaPortfolioCanvasScene";

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
    imageClass: "scale-[1.06]",
    mediaZoom: 1.02,
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
    text: "Solid infrastructure. Developer ready Figma component sets built to stand out.",
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

  useEffect(() => {
    const timer = window.setTimeout(() => rootRef.current?.remove(), reduced ? 220 : 1150);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className={`preloader fixed inset-0 z-[1000] flex h-screen w-full items-center justify-center bg-black pointer-events-none ${
        reduced ? "preloader-reduced" : ""
      }`}
    >
      <h1 className="preloader-title font-display text-4xl font-light uppercase text-white md:text-6xl">
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
        className={`footer-field-control min-w-0 w-full rounded-[1px] border border-[#94A3B8] bg-transparent px-[11px] font-jakarta text-base font-normal normal-case leading-6 text-white outline-none placeholder:text-white/60 ${
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

function ProductIntro() {
  return (
    <section className="hidden h-[592px] w-full flex-col items-start py-[72px] min-[1199px]:flex">
      <div className="flex h-[158px] w-full flex-col gap-10 pb-1 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <Display className="lg:tracking-[-6.72px]" webglHero>UX/UI</Display>
        <div className="flex w-[286px] max-w-full flex-col items-start gap-[42px] lg:h-[75px] lg:w-[359px] lg:gap-0 lg:pr-8 lg:pt-1">
          <MonoText webglHero className="w-full max-w-[327px] font-normal">
            Shaping clear visual interfaces for thoughtful digital products and the people who use them.
          </MonoText>
        </div>
      </div>
      <div className="flex w-full flex-col items-start text-white">
        <Display buffon webglHero>
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
            <span data-gl-text data-gl-text-no-fluid>About.</span>
            <br className="max-[599px]:block hidden" />
            {" "}
            <span data-gl-text data-gl-text-no-fluid className="text-white/60">
              I am a senior UX/UI designer. Strong product structure and refined visuals go hand in hand. Working independently, I create design systems that move business forward and save development time.{" "}
            </span>
            <span data-gl-text data-gl-text-no-fluid>The result: no chaotic iterations — just constructive decisions that make sense.</span>
          </div>
          <div className="flex h-auto w-[353px] max-w-full flex-col gap-[42px] pr-6 min-[387px]:h-[165px]">
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
      <MonoText webglHero={webglHero} className="h-[75px] w-[264px] !font-normal !text-base !leading-[25px]">
        A web/UI designer crafting intuitive and engaging digital experiences
      </MonoText>
    </div>
  );
}

function PurposeTitle() {
  return (
    <div className="w-full">
      <div className="flex w-full flex-col min-[875px]:hidden">
        <div className="flex h-[253px] w-full flex-col items-end gap-6 min-[600px]:max-[874px]:h-[178px]">
          <PurposeMiniText />
          <h2 className="h-[150px] w-full font-display text-[78px] font-light uppercase leading-[75px] tracking-[-3.12px] text-white min-[600px]:max-[874px]:h-[75px]">
            <span>design</span>
            <br className="max-[599px]:block hidden" />
            {" "}
            <span className="min-[600px]:max-[874px]:float-right">with</span>
          </h2>
        </div>
        <div className="flex h-[85px] w-full items-end">
          <h2 className="h-[85px] w-[347px] whitespace-nowrap font-buffon text-[84px] font-normal uppercase leading-[85px] text-white">
            purpose
          </h2>
        </div>
      </div>

      <div className="hidden w-full flex-col min-[875px]:max-[1198px]:flex">
        <div className="flex h-[136px] w-full items-start justify-between">
          <h2 className="w-[437px] whitespace-nowrap text-right font-display text-[126px] font-light uppercase leading-[136px] tracking-[-5.04px] text-white">
            digital
          </h2>
          <div className="pt-1">
            <PurposeMiniText webglHero />
          </div>
        </div>
        <h2 className="mt-[-14px] h-[136px] w-full whitespace-nowrap text-center font-display text-[126px] font-light uppercase leading-[136px] tracking-[-5.04px] text-white">
          design with
        </h2>
        <h2 className="h-[122px] w-[544px] whitespace-nowrap font-buffon text-[132px] font-normal uppercase leading-[122px] text-white">
          purpose
        </h2>
      </div>

      <div className="hidden w-full min-[1199px]:block">
        <div className="flex h-[154px] w-full items-start gap-28">
          <Display webglHero className="!text-[168px] !leading-[154px] !tracking-[-6.72px]">digital</Display>
          <div className="pt-2">
            <MonoText webglHero className="h-[75px] w-[264px] font-normal !text-base !leading-[25px]">
              A web/UI designer crafting intuitive and engaging digital experiences
            </MonoText>
          </div>
        </div>
        <div className="flex h-[154px] w-full items-center pl-0 min-[1400px]:pl-[202px]">
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
    <section className="purpose-section flex w-full flex-col py-[40px] min-[1199px]:py-[72px]">
      <PurposeTitle />

      <div className="purpose-columns mt-16 flex w-full flex-col gap-[72px] min-[875px]:mt-0 min-[875px]:flex-row min-[875px]:items-start min-[875px]:justify-between min-[875px]:gap-20">
        <div className="flex w-full flex-col gap-[24px] min-[875px]:w-[362px] min-[875px]:gap-10 min-[875px]:max-[1198px]:pt-[344px] min-[1199px]:pt-[280px]">
          {advantageCards.map((card) => {
            const isThirdCard = card.number === "03/";
            return (
            <div {...(isThirdCard ? {} : { "data-gl-flow-text": true, "data-gl-fluid-boost": true })} className="flex w-full items-start gap-[32px]" key={card.number}>
              {isThirdCard ? (
                <div data-gl-flow-text data-gl-fluid-boost className="h-[25px] shrink-0 whitespace-nowrap">
                  <MonoText bold>{card.number}</MonoText>
                </div>
              ) : (
                <MonoText bold className="h-[25px] shrink-0 whitespace-nowrap">
                  {card.number}
                </MonoText>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-5">
                {isThirdCard ? (
                  <div data-gl-flow-text data-gl-fluid-boost>
                    <MonoText bold>{card.title}</MonoText>
                  </div>
                ) : (
                  <MonoText bold>{card.title}</MonoText>
                )}
                {isThirdCard ? (
                  <div data-gl-flow-text data-gl-fluid-boost>
                    <MonoText className="font-bold min-[875px]:font-normal">{card.text}</MonoText>
                  </div>
                ) : (
                  <MonoText className="font-bold min-[875px]:font-normal">{card.text}</MonoText>
                )}
              </div>
            </div>
            );
          })}
        </div>

        <div className="flex w-full flex-col gap-4 min-[875px]:max-[1198px]:w-[251px] min-[875px]:max-[1198px]:pt-16 min-[1199px]:h-[361px] min-[1199px]:w-[334px] min-[1199px]:pr-[108px] min-[1400px]:w-[359px]">
          <MonoText webglHero className="w-full max-w-full font-bold min-[875px]:w-[251px] min-[875px]:font-normal">
            Delivering tailored solutions for my <br className="hidden max-md:block" /> clients
          </MonoText>
          <div className="flex w-full flex-col gap-[42px] min-[875px]:w-[251px] min-[875px]:max-w-full min-[1199px]:max-w-none">
            <div data-gl-background data-gl-hero-background className="flex w-full flex-col overflow-hidden border-y border-white">
              {services.map((service, index) => (
                <div data-gl-background data-gl-hero-background className={`flex h-[41px] items-center min-[1199px]:h-[42px] ${index === 0 ? "" : "border-t border-white"}`} key={service}>
                  <MonoText webglHero className="whitespace-nowrap font-bold min-[875px]:font-normal">{service}</MonoText>
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
    <section className="mt-0 flex w-full flex-col gap-2 py-[40px] min-[1199px]:py-[72px]">
      <div className="flex w-full flex-wrap items-end justify-between gap-y-[12px]">
        <Display webglHero className="shrink-0 !text-[78px] !leading-[84px] !tracking-[-3.12px] min-[873px]:max-[1198px]:!text-[126px] min-[873px]:max-[1198px]:!leading-[136px] min-[873px]:max-[1198px]:!tracking-[-5.04px] min-[1199px]:!text-[168px] min-[1199px]:!leading-[154px] min-[1199px]:!tracking-[-6.72px]">some</Display>
        <Display webglHero className="relative top-[-14px] ml-auto basis-full shrink-0 !text-[78px] !leading-[84px] !tracking-[-3.12px] min-[506px]:top-0 min-[506px]:basis-auto min-[873px]:max-[1198px]:!text-[126px] min-[873px]:max-[1198px]:!leading-[136px] min-[873px]:max-[1198px]:!tracking-[-5.04px] min-[1199px]:!text-[168px] min-[1199px]:!leading-[154px] min-[1199px]:!tracking-[-6.72px]">of my</Display>
      </div>
      <div className="relative top-[-18px] flex w-full items-center pl-0 min-[506px]:top-[-2px] min-[600px]:top-[-2px] min-[600px]:pl-[140px] min-[1199px]:top-0 min-[1199px]:pl-[188px]">
        <Display webglHero buffon className="w-full !text-[84px] !leading-[85px] min-[873px]:max-[1198px]:!text-[132px] min-[873px]:max-[1198px]:!leading-[122px] min-[1199px]:!text-[175px] min-[1199px]:!leading-[180.7px] min-[1199px]:tracking-[1.75px]">
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
      <div
        data-gl-media
        data-gl-hero-media
        {...(work.mediaZoom ? { "data-gl-media-zoom": work.mediaZoom } : {})}
        className="relative h-[480px] w-full overflow-hidden bg-white lg:h-[480px]"
      >
        <img src={work.image} alt="" className={`h-full w-full object-cover ${work.imageClass ?? ""}`} />
        {work.maskBottomEdge ? <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[6px] bg-[#062322]" /> : null}
      </div>
      <div
        data-gl-background
        data-gl-hero-background
        className="flex w-full items-start justify-between gap-4 border-b border-white pb-3 font-jakarta text-base font-normal uppercase leading-[25px] text-white md:max-lg:pb-[11px]"
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
      <div className="flex w-full flex-col gap-[72px] py-[40px] min-[1199px]:hidden">
        <div className="flex w-full justify-start min-[600px]:justify-end">
          <ProjectCard work={works[0]} />
        </div>
        <div className="flex w-full justify-start">
          <ProjectCard work={works[2]} />
        </div>
      </div>

      <div className="hidden w-full min-[1199px]:block">
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
  const [submitStatus, setSubmitStatus] = useState("idle");
  const successTimerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(successTimerRef.current), []);

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
    setSubmitStatus("idle");
  };
  const markFieldTouched = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
    setFormTouched((current) => ({ ...current, [name]: true }));
    setSubmitStatus("idle");
  };
  const submitFooterForm = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    setSubmitStatus("idle");
    window.clearTimeout(successTimerRef.current);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setSubmitStatus("sending");

    try {
      const response = await fetch(event.currentTarget.action, {
        method: "POST",
        body: new FormData(event.currentTarget),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Form submit failed");

      setSubmitStatus("success");
      setFormValues({ email: "", name: "", project: "", message: "" });
      setFormTouched({});
      setFormSubmitted(false);
      successTimerRef.current = window.setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <section className="relative mt-0 flex w-full flex-col pt-[40px] lg:mt-0 lg:h-[874px] lg:pt-[72px]">
      <div className="flex w-full items-start justify-between">
        <p data-gl-flow-text data-gl-fluid-boost className="shrink-0 whitespace-nowrap font-jakarta text-[13px] font-normal uppercase leading-[25px] text-white/40">
          Start a project
        </p>
        <p data-gl-text data-gl-hero-text className="w-[288px] font-jakarta text-base font-normal uppercase leading-[25px] text-right text-white lg:w-[180px]">
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
          <video
            src={contactLiquidVideo}
            poster={footerFormImage}
            className="contact-video h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        </div>

        <form id={contactFormId} action={formSubmitHref} method="POST" className="order-1 flex min-w-0 flex-col gap-[24px] max-md:gap-[32px] md:order-2 md:max-lg:!order-1 md:max-lg:!h-[412px] md:max-lg:!w-full md:max-lg:!gap-[32px] lg:gap-[32px]" aria-label="Project request form" noValidate onSubmit={submitFooterForm}>
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
              placeholder="e.g. hello@company.com"
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
                placeholder="e.g. Jane Smith"
                value={formValues.name}
              />
              <FooterField
                label="Company name"
                name="project"
                onBlur={markFieldTouched}
                onChange={updateField}
                placeholder="e.g. Northstar Studio"
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
              placeholder="e.g. I need a website for..."
              required={false}
              value={formValues.message}
            />
          </div>
          <div className="relative">
            <button
              className="flex h-12 w-full items-center justify-center border-b border-black bg-white px-10 font-jakarta text-base font-bold uppercase leading-[25px] text-black transition duration-200 lg:hover:bg-[#A40000] lg:hover:text-white/90 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-wait disabled:bg-white/65"
              disabled={submitStatus === "sending"}
              type="submit"
            >
              <span className="block whitespace-nowrap leading-[25px]">
                {submitStatus === "sending" ? "Sending..." : "Start a project"}
              </span>
            </button>
            <p
              aria-live="polite"
              className={`pointer-events-none absolute left-0 top-full mt-1 w-full text-center font-jakarta text-[14px] font-normal normal-case leading-5 transition-opacity duration-300 ease-out ${
                submitStatus === "success" ? "text-white opacity-100" : submitStatus === "error" ? "text-red-400 opacity-100" : "opacity-0"
              }`}
            >
              {submitStatus === "error" ? "Could not send your message. Please try again." : "Message sent successfully"}
            </p>
          </div>
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
            </>
          }
        >
          <HeroFirstScreen />
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
        <SectionShell shellClassName="footer-shell">
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
      <main className="relative z-[910] flex min-h-screen flex-col gap-0 overflow-x-hidden pb-5 pt-[49px] lg:gap-0 lg:pb-[40px] lg:pt-[32px]" aria-label="Anna Loban portfolio">
        <StableHeroGridOverlay />
        <StableHeroCtaOverlay />
        <div className="relative z-10 flex flex-col gap-0">
          {page}
        </div>
      </main>
    </>
  );
}
