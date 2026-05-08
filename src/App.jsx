import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { CanvasScene } from "./webgl/CanvasScene.js";

import desktopProject1 from "../assets/ai-portfolio/figma/desktop-project-1.png";
import desktopProject2 from "../assets/ai-portfolio/figma/desktop-project-2.png";
import desktopProject3 from "../assets/ai-portfolio/figma/desktop-project-3.png";
import desktopProject4 from "../assets/ai-portfolio/figma/desktop-project-4.png";
import mobileProject1 from "../assets/ai-portfolio/figma/mobile-project-1.png";
import mobileProject2 from "../assets/ai-portfolio/figma/mobile-project-2.png";
import mobileProject3 from "../assets/ai-portfolio/figma/mobile-project-3.png";
import mobileProject4 from "../assets/ai-portfolio/figma/mobile-project-4.png";
import desktopStroke from "../assets/ai-portfolio/figma/desktop-red-stroke.svg";
import mobileStroke from "../assets/ai-portfolio/figma/mobile-red-stroke.svg";

const briefHref = "mailto:ann.loban@gmail.com?subject=Website%20or%20visual%20system%20brief";
const footerLinks = [
  { label: "telegram", href: "https://t.me/anna_loban" },
  { label: "Linkedin", href: "https://www.linkedin.com/in/annloban/" },
  { label: "dribbble", href: "https://dribbble.com/azzaza" },
];

const works = [
  {
    name: "24 colab",
    href: "https://24colab.com/",
    desktop: desktopProject1,
    mobile: mobileProject1,
  },
  {
    name: "your dissertation",
    href: "https://yourdissertation.com",
    desktop: desktopProject2,
    mobile: mobileProject2,
  },
  {
    name: "smart business intelligence",
    href: "https://smartbusinessintelligence.co.uk",
    desktop: desktopProject3,
    mobile: mobileProject3,
  },
  {
    name: "Vegas Expert",
    href: "https://www.behance.net/gallery/55414069/Vegas-Expert-Package",
    desktop: desktopProject4,
    mobile: mobileProject4,
  },
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

function BookButton({ className = "" }) {
  return (
    <a
      href={briefHref}
      data-gl-media
      className={`relative block h-8 w-32 cursor-pointer overflow-hidden bg-white px-2 pb-[6px] pt-0.5 text-black ${className}`}
    >
      <span
        data-gl-text
        data-color="black"
        className="absolute left-1/2 top-1/2 whitespace-nowrap font-mono text-base font-semibold uppercase leading-none -translate-x-1/2 -translate-y-1/2"
      >
        Send a brief
      </span>
    </a>
  );
}

function Display({ as: Tag = "h2", children, className = "", dataText = true }) {
  return (
    <Tag
      data-gl-text={dataText ? "" : undefined}
      className={`font-display text-[56px] font-light uppercase leading-[58px] tracking-normal text-white md:text-[92px] md:leading-[88px] lg:text-[168px] lg:leading-[154px] lg:tracking-[-7px] whitespace-nowrap ${className}`}
    >
      {children}
    </Tag>
  );
}

function MonoText({ children, className = "", color = "white", justify = false, dataText = true }) {
  return (
    <p
      data-gl-text={dataText ? "" : undefined}
      data-color={color}
      className={`font-mono text-base font-normal uppercase leading-[25px] text-white lg:font-normal ${justify ? "text-justify" : ""} ${className}`}
    >
      {children}
    </p>
  );
}

function Hero() {
  return (
    <header className="relative flex w-full flex-col gap-[114px] overflow-hidden bg-black lg:gap-[154px]">
      <div className="flex w-full items-end justify-between leading-none">
        <div className="whitespace-nowrap">
          <Display as="h1">
            Iam <br />
            ANNa
          </Display>
        </div>
        <MonoText className="hidden whitespace-nowrap lg:block">Based in</MonoText>
      </div>

      <div className="flex w-full flex-col items-start gap-[100px] lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="flex w-[286px] flex-col items-start gap-[42px] lg:w-[359px]">
          <MonoText className="w-[286px]">
            I create website designs for people and help them grow their business.
          </MonoText>
          <BookButton />
        </div>
        <div className="ml-0 w-fit whitespace-nowrap lg:ml-auto">
          <Display className="font-normal lg:font-light">
            Creative <br />
            designer
          </Display>
        </div>
      </div>
    </header>
  );
}

function StatementAndServices() {
  return (
    <section className="relative w-full overflow-visible bg-black">
      <picture>
        <source media="(min-width: 1024px)" srcSet={desktopStroke} />
        <img
          src={mobileStroke}
          alt=""
          className="red-stroke-bg pointer-events-none absolute left-[-54px] top-[126px] z-0 h-[456px] w-[428px] max-w-none opacity-90 md:left-[4%] md:top-[100px] md:h-[760px] md:w-[712px] lg:left-[150px] lg:top-[180px] lg:h-[1189px] lg:w-[1254px]"
        />
      </picture>

      <div className="relative z-10 flex w-full flex-col gap-[114px] lg:gap-[154px]">
        <div className="flex w-full flex-col items-start justify-center">
          <div className="flex w-full items-start justify-center lg:justify-between">
            <MonoText className="hidden w-[265px] lg:block">
              I create website with full of passion and dedication.
            </MonoText>
            <Display>Create</Display>
            <MonoText className="hidden w-[171px] whitespace-nowrap lg:block">
              Stay ahead of
              <br />
              the crowd.
            </MonoText>
          </div>
          <div className="flex w-full items-start justify-center lg:justify-start lg:pl-24">
            <Display>website</Display>
          </div>
          <div className="flex w-full items-start justify-center lg:justify-start lg:pl-[clamp(320px,22vw,468px)] lg:pr-0">
            <Display>that truly</Display>
          </div>
          <div className="flex w-full items-end justify-center gap-[180px] lg:justify-start lg:pl-[282px]">
            <Display>inspires</Display>
            <MonoText className="hidden w-[227px] lg:block">
              A web/UI designer creating clear digital experiences.
            </MonoText>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-end lg:gap-[205px]">
          <div className="flex w-[286px] flex-col items-start gap-[42px] lg:w-[263px]">
            <MonoText className="w-[286px]">
              services I provided to
              <br />
              my clients.
            </MonoText>
            <BookButton />
          </div>
          <div className="w-full pb-px lg:w-[455px]">
            {["UX/UI solutions", "Visual web design", "Frontend-ready systems"].map(
              (item, index) => (
                <div
                  data-gl-background
                  className="-mb-px flex min-h-[68px] w-full items-center border-y border-white py-0"
                  key={`${item}-${index}`}
                >
                  <div className="relative z-40 flex items-center gap-[80px] whitespace-nowrap font-jakarta text-base font-medium uppercase leading-none text-white md:gap-[88px] lg:text-2xl">
                    <span data-gl-text className="w-4 text-2xl leading-none lg:text-2xl">
                      {index + 1}{" "}
                    </span>
                    <span data-gl-text className="leading-none">{item}</span>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Works() {
  return (
    <section className="w-full overflow-hidden bg-black">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <Display>some</Display>
          <Display>of my</Display>
        </div>
        <div className="flex w-full items-center justify-center pl-20 lg:justify-start lg:pl-[188px]">
          <Display className="w-[320px] text-left lg:w-[1338px]">works</Display>
        </div>
      </div>

      <MonoText className="mt-[114px] w-[254px] lg:hidden">
        Selected work across business websites, visual.
      </MonoText>

      <div className="mt-[114px] flex w-full flex-col items-start gap-8 lg:mt-[154px] lg:gap-0 lg:pb-8">
        <div className="flex w-full flex-col-reverse items-start justify-between gap-20 lg:mb-[-32px] lg:flex-row lg:gap-8">
          <WorkCard work={works[0]} />
          <MonoText className="hidden w-[254px] lg:block">
            Selected work across business websites, visual.
          </MonoText>
        </div>
        <div className="flex w-full justify-start lg:mb-[-32px] lg:justify-end">
          <WorkCard work={works[1]} />
        </div>
        <div className="flex w-full justify-start lg:mb-[-32px]">
          <WorkCard work={works[2]} />
        </div>
        <div className="flex w-full flex-col items-start justify-between gap-20 lg:mb-[-32px] lg:flex-row lg:items-end lg:gap-8">
          <MonoText className="hidden w-[254px] lg:block">
            Clear structure, visual character and more thoughtful web experiences.
          </MonoText>
          <WorkCard work={works[3]} />
        </div>
      </div>
    </section>
  );
}

function WorkCard({ work }) {
  return (
    <article className="work group flex w-[321px] max-w-full flex-col gap-3 md:w-[360px] lg:w-[411px]">
      <div data-gl-media className="relative h-[422px] w-[321px] max-w-full overflow-hidden bg-white md:h-[474px] md:w-[360px] lg:h-[542px] lg:w-[412px]">
        <picture>
          <source media="(min-width: 1024px)" srcSet={work.desktop} />
          <img
            src={work.mobile}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] lg:group-hover:scale-100"
          />
        </picture>
      </div>
      <div
        data-gl-background
        className="flex w-full items-start justify-between gap-4 border-b border-white pb-3 font-mono text-base font-normal uppercase leading-[25px] text-white"
      >
        <span className="min-w-0 whitespace-nowrap">
          {work.name}
        </span>
        <a
          href={work.href}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 underline"
        >
          Live
        </a>
      </div>
    </article>
  );
}

function Footer() {
  return (
    <section className="w-full bg-black">
      <div className="mx-auto flex w-full flex-col items-center gap-[27px] lg:w-[898px]">
        <Display dataText={false} className="mx-auto block w-full !whitespace-pre-wrap text-center lg:w-[898px]">
          lets leave
          <br />a mark
        </Display>
        <div className="flex w-full flex-col items-center gap-[42px] lg:w-[356px]">
          <MonoText className="w-full text-center lg:w-[356px]">
            clear direction and design created with purpose. Only thoughtful solutions.
          </MonoText>
          <BookButton />
          <MonoText className="w-[286px] text-center">available for selected projects.</MonoText>
        </div>
      </div>
      <footer className="mt-[276px] flex w-full items-center justify-between whitespace-nowrap font-mono text-base font-normal uppercase leading-[25px] text-white">
        {footerLinks.map((link) => (
          <a
            data-gl-text
            href={link.href}
            target={link.external === false ? undefined : "_blank"}
            rel={link.external === false ? undefined : "noreferrer"}
            className="underline"
            key={link.label}
          >
            {link.label}
          </a>
        ))}
      </footer>
    </section>
  );
}

function WebGLCanvasLayer({ reduced }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (reduced || !canvasRef.current) return undefined;

    const scene = new CanvasScene({
      canvas: canvasRef.current,
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
        <div className="relative z-10 flex w-full flex-col gap-[114px] lg:gap-[154px]">
          <Hero />
          <StatementAndServices />
          <Works />
        </div>
        <Footer />
      </>
    ),
    [],
  );

  return (
    <>
      <Preloader reduced={reduced} />
      <WebGLCanvasLayer reduced={reduced} />
      <main className="relative flex min-h-screen flex-col gap-[154px] overflow-hidden bg-black p-5 md:p-9 lg:p-[60px]" aria-label="Anna Loban portfolio">
        {page}
      </main>
    </>
  );
}
