import React from "react";
import { Button, Display, MonoText } from "../components/PortfolioPrimitives.jsx";
import { ResponsiveProductDesignerIntro, ResponsiveUxIntro } from "./ProductDesignerIntro.jsx";
import "./Hero.css";

const desktopGridStops = ["0%", "33.333333%", "66.666667%", "100%"];

export function StableHeroGridOverlay() {
  const labels = [
    { stop: desktopGridStops[0], text: "Personal page", fluidBoost: true },
    { stop: desktopGridStops[1], text: "Poland, Poznan" },
  ];

  return (
    <div className="desktop-hero-overlay-safe desktop-hero-labels-safe pointer-events-none absolute inset-x-0 top-[-2px] z-[950] hidden h-[calc(100dvh+2px)] min-[1199px]:block" aria-hidden="true">
      <div className="section-shell relative h-full">
        <div className="desktop-hero-grid-rail absolute inset-y-0">
          {desktopGridStops.map((stop) => (
            <span
              key={stop}
              className="absolute top-0 h-full w-px bg-[linear-gradient(to_bottom,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_82%,rgba(255,255,255,0)_100%)]"
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
                <span
                  {...(label.fluidBoost ? { "data-gl-hero-background": true } : {})}
                  className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white"
                />
                <span
                  {...(label.fluidBoost ? { "data-gl-hero-background": true } : {})}
                  className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white"
                />
              </span>
              <span
                {...(label.fluidBoost ? { "data-gl-flow-text": true, "data-gl-fluid-boost": true } : { "data-gl-text": true, "data-gl-hero-text": true })}
                className="whitespace-nowrap"
              >
                {label.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StableHeroCtaOverlay() {
  return (
    <div className="desktop-hero-overlay-safe desktop-hero-cta-safe pointer-events-none absolute inset-x-0 top-[-2px] z-[960] hidden h-[calc(100dvh+2px)] min-[1199px]:block">
      <div className="section-shell relative h-full">
        <div className="desktop-hero-grid-rail absolute inset-y-0">
          <div
            className="desktop-hero-grid-anchor hero-top-brief-card pointer-events-auto absolute top-[236px] flex items-start gap-[11px]"
            style={{ left: desktopGridStops[2] }}
          >
            <span className="relative block h-[20px] w-[20px] shrink-0" aria-hidden="true">
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white" />
            </span>
            <div className="mt-[-4px] flex min-w-0 flex-1 flex-col items-start gap-[26px] pr-8">
              <MonoText webglHero italic className="w-full !text-[20px] font-normal !leading-[33px] md:!text-[20px] md:!leading-[33px]">
                Digital design beyond trends — built to be clear, logical, and easy to launch.
              </MonoText>
              <Button webglHero />
            </div>
          </div>
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

export function ResponsiveViewportGuide() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[-220px] z-20 h-[1054px] min-[601px]:max-[874px]:top-[-140px] min-[601px]:max-[874px]:h-[1072px] md:top-[-140px] md:h-[1072px] min-[1199px]:hidden" aria-hidden="true">
      <span className="absolute left-[10px] top-0 h-full w-px bg-gradient-to-b from-white/25 via-white/25 to-transparent" />
      <span className="absolute right-[10px] top-0 h-full w-px bg-gradient-to-b from-white/25 via-white/25 to-transparent" />
    </div>
  );
}

function ResponsiveHeroIntro() {
  return (
    <>
      <div className="hero-cta-block absolute left-0 top-[112px] z-20 flex w-[390px] max-w-none items-start gap-[11px] min-[1199px]:hidden">
        <PlusMarker className="mt-2" />
        <div className="hero-cta-content flex w-[359px] shrink-0 flex-col items-start gap-[26px] pr-8">
          <MonoText italic className="hero-cta-copy w-full !text-[20px] font-normal !leading-[33px] md:!text-[20px] md:!leading-[33px]">
            Digital design beyond trends — built to be clear, logical, and easy to launch.
          </MonoText>
          <Button className="hero-cta-button h-12" />
        </div>
      </div>

      <div className="responsive-hero-block relative w-full overflow-visible">
        <div className="hero-title-block relative left-0 z-10 w-full">
          <h1
            aria-label="Anna Loban, UX/UI Designer and Landing Page Designer"
            data-gl-text
            className="mb-[-8px] w-fit whitespace-nowrap font-buffon text-[84px] font-normal uppercase leading-[85px] text-white"
          >
            Hello!
          </h1>
          <div className="hero-anna-row w-full">
            <h2 data-gl-text className="hero-tablet-anna-heading w-fit whitespace-nowrap font-display text-[78px] font-light uppercase leading-[84px] tracking-[-3.12px] text-white">
              Iam ANNa
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}

function ResponsiveIntro() {
  return (
    <section className="responsive-intro relative w-full min-[601px]:max-[874px]:mx-auto md:w-full min-[1199px]:hidden">
      <ResponsiveHeroIntro />
      <div className="ux-block relative flex flex-col items-start">
        <ResponsiveUxIntro />
        <ResponsiveProductDesignerIntro />
      </div>
    </section>
  );
}

export function Hero() {
  return (
    <header className="hero-desktop-title-stack relative hidden h-[748px] w-full flex-col gap-2 overflow-visible pb-0 pt-[354px] min-[1199px]:flex">
      <div className="relative z-10 flex w-full items-center">
        <Display as="div" buffon webglHero className="hero-desktop-hello-heading">
          Hello!
        </Display>
      </div>
      <div className="relative z-10 flex w-full items-end lg:pl-[287px]">
        <Display as="h2" className="hero-desktop-anna-heading text-right lg:tracking-[-6.72px]" webglHero>
          Iam ANNa
        </Display>
      </div>
    </header>
  );
}

export function HeroFirstScreen() {
  return (
    <>
      <ResponsiveIntro />
      <Hero />
    </>
  );
}
