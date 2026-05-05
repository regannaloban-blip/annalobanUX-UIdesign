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

const works = [
  {
    name: "Name project",
    href: "https://24colab.com/",
    desktop: desktopProject1,
    mobile: mobileProject1,
  },
  {
    name: "Name project",
    href: "https://yourdissertation.com",
    desktop: desktopProject2,
    mobile: mobileProject2,
  },
  {
    name: "Name project",
    href: "https://smartbusinessintelligence.co.uk",
    desktop: desktopProject3,
    mobile: mobileProject3,
  },
  {
    name: "Name project",
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
      href="mailto:ann.loban@gmail.com"
      data-gl-media
      className={`relative block h-8 w-32 cursor-pointer overflow-hidden bg-white px-2 pb-[6px] pt-0.5 text-black ${className}`}
    >
      <span
        data-gl-text
        data-color="black"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-base font-semibold uppercase leading-[25px]"
      >
        Book a call
      </span>
    </a>
  );
}

function Display({ as: Tag = "h2", children, className = "", dataText = true }) {
  return (
    <Tag
      data-gl-text={dataText ? "" : undefined}
      className={`font-display text-[56px] font-light uppercase leading-[58px] tracking-[-0.04em] text-white lg:text-[168px] lg:leading-[154px] ${className}`}
    >
      {children}
    </Tag>
  );
}

function MonoText({ children, className = "", color = "white", justify = false }) {
  return (
    <p
      data-gl-text
      data-color={color}
      className={`font-mono text-base font-normal uppercase leading-[25px] text-white lg:font-normal ${justify ? "text-justify" : ""} ${className}`}
    >
      {children}
    </p>
  );
}

function Hero() {
  return (
    <header className="relative flex min-h-screen w-full flex-col gap-[114px] overflow-hidden bg-black p-5 lg:gap-[154px] lg:p-[60px]">
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
        <div className="flex w-[286px] flex-col items-start gap-[42px]">
          <MonoText className="w-[286px]">
            I make designs and develop
            <br />
            websites for people and help
            <br />
            them to grow their buisiness.
          </MonoText>
          <BookButton />
        </div>
        <div className="ml-0 w-fit whitespace-nowrap lg:ml-auto">
          <Display className="font-normal lg:font-light">
            Creative <br />
            <span className="lg:hidden">dev</span>
            <span className="hidden lg:inline">designer</span>
          </Display>
        </div>
      </div>
    </header>
  );
}

function StatementAndServices() {
  return (
    <section className="relative w-full overflow-visible bg-black p-5 lg:p-[60px] lg:pt-0">
      <picture>
        <source media="(min-width: 1024px)" srcSet={desktopStroke} />
        <img
          src={mobileStroke}
          alt=""
          className="pointer-events-none absolute left-[-54px] top-[194px] z-0 h-[456px] w-[428px] max-w-none opacity-95 blur-[1px] lg:left-[150px] lg:top-[315px] lg:h-[1189px] lg:w-[1254px]"
        />
      </picture>

      <div className="relative z-10 flex w-full flex-col gap-[114px] lg:gap-[154px]">
        <div className="flex w-full flex-col items-start justify-center">
          <div className="flex w-full items-start justify-between">
            <MonoText className="hidden w-[205px] text-justify lg:block">
              I create website with full of passion and dedication.
            </MonoText>
            <Display className="tracking-[-0.06em]">Create</Display>
            <MonoText className="hidden whitespace-nowrap lg:block">
              Stay ahead of
              <br />
              the crowd.
            </MonoText>
          </div>
          <div className="flex w-full items-start justify-center lg:justify-start lg:pl-[128px]">
            <Display className="tracking-[-0.08em]">website</Display>
          </div>
          <div className="flex w-full items-start justify-center lg:justify-start lg:px-[464px]">
            <Display className="tracking-[-0.07em]">that truly</Display>
          </div>
          <div className="flex w-full items-start justify-center gap-[190px] lg:justify-start lg:pl-[298px]">
            <Display className="tracking-[-0.07em]">inspires</Display>
            <MonoText className="hidden w-[227px] text-justify lg:block">
              A spesialized digital
              <br />
              designer and developer
              <br />
              bazed in india.
            </MonoText>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-end lg:gap-[205px]">
          <div className="flex w-[286px] flex-col items-start gap-[34px] lg:gap-[42px]">
            <MonoText className="w-[286px]">
              servises I provided to
              <br />
              my cliens
            </MonoText>
            <BookButton />
          </div>
          <div className="w-full pb-px lg:w-[486px]">
            {["Hight quality website", "Hight quality website", "Hight quality website"].map(
              (item, index) => (
                <div
                  data-gl-background
                  className="-mb-px flex w-full border-y border-white py-5"
                  key={`${item}-${index}`}
                >
                  <div className="flex gap-[112px] whitespace-nowrap font-jakarta text-base font-normal uppercase leading-[25px] text-white lg:text-2xl">
                    <span data-gl-text>{index + 1} </span>
                    <span data-gl-text>{item}</span>
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
    <section className="w-full overflow-hidden bg-black p-5 pt-0 lg:p-[60px] lg:pt-0">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <Display>some</Display>
          <Display className="hidden lg:block">of my</Display>
        </div>
        <div className="flex w-full items-center justify-end lg:justify-start lg:pl-[224px]">
          <Display className="w-full text-right lg:w-[1338px] lg:text-left">works</Display>
        </div>
      </div>

      <MonoText className="mt-[114px] w-[254px] text-justify lg:hidden">
        As a develorer and designer these are some proves of my passion.
      </MonoText>

      <div className="mt-8 flex w-full flex-col items-start gap-8 lg:mt-[154px] lg:gap-0 lg:pb-8">
        <div className="flex w-full flex-col-reverse items-start justify-between gap-20 lg:mb-[-32px] lg:flex-row lg:gap-8">
          <WorkCard work={works[0]} />
          <MonoText className="hidden w-[254px] text-justify lg:block">
            As a develorer and designer these are some proves of my passion.
          </MonoText>
        </div>
        <div className="flex w-full justify-start lg:mb-[-32px] lg:justify-end">
          <WorkCard work={works[1]} />
        </div>
        <div className="flex w-full justify-start lg:mb-[-32px]">
          <WorkCard work={works[2]} />
        </div>
        <div className="flex w-full flex-col items-start justify-between gap-20 lg:mb-[-32px] lg:flex-row lg:items-end lg:gap-8">
          <MonoText className="hidden w-[254px] text-justify lg:block">
            every pixels tell a story. more stories are on the way.
          </MonoText>
          <WorkCard work={works[3]} />
        </div>
      </div>
    </section>
  );
}

function WorkCard({ work }) {
  return (
    <article className="work group flex w-[321px] flex-col gap-3 lg:w-[411px]">
      <div data-gl-media className="relative h-[422px] w-[321px] overflow-hidden bg-white lg:h-[542px] lg:w-[412px]">
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
        className="flex w-full justify-between border-b border-white pb-3 font-mono text-base font-normal uppercase leading-[25px] text-white"
      >
        <span data-gl-text>{work.name} </span>
        <a data-gl-text href={work.href} target="_blank" rel="noreferrer" className="underline">
          Live
        </a>
      </div>
    </article>
  );
}

function Footer() {
  return (
    <section className="w-full bg-black p-5 pb-10 pt-[154px] lg:p-[60px] lg:pb-[60px] lg:pt-[276px]">
      <div className="mx-auto flex w-full flex-col items-center gap-[27px] lg:w-[898px]">
        <Display className="w-full whitespace-pre-wrap text-center tracking-[-0.07em]">
          lets  leave
          <br />a mark
        </Display>
        <div className="flex w-[286px] flex-col items-center gap-[42px]">
          <MonoText className="w-[286px] text-center">availabale for rroject</MonoText>
          <BookButton />
        </div>
      </div>
      <footer className="mt-[276px] flex w-full items-center justify-between whitespace-nowrap font-mono text-base font-normal uppercase leading-[25px] text-white">
        <a data-gl-text href="https://www.instagram.com/" target="_blank" rel="noreferrer">
          Insta
        </a>
        <a data-gl-text href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
          Linkedin
        </a>
        <a data-gl-text href="mailto:ann.loban@gmail.com">
          mail
        </a>
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
        <Hero />
        <StatementAndServices />
        <Works />
        <Footer />
        <section className="relative hidden h-screen w-full overflow-clip pointer-events-none lg:block" aria-hidden="true">
          <div className="absolute left-0 top-0 min-h-screen w-full">
            <Hero />
          </div>
        </section>
      </>
    ),
    [],
  );

  return (
    <>
      <Preloader reduced={reduced} />
      <WebGLCanvasLayer reduced={reduced} />
      <main className="min-h-screen bg-black" aria-label="Anna Loban portfolio">
        {page}
      </main>
    </>
  );
}
