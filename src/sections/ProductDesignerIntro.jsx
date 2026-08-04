import React from "react";
import { Display, MonoText } from "../components/PortfolioPrimitives.jsx";

export function ResponsiveUxIntro() {
  return (
    <div className="ux-title-row flex w-full flex-col gap-6 pb-1 pt-2 max-[874px]:mb-[-6px]">
      <MonoText className="ux-mini-text ml-auto w-full max-w-[296px] font-normal">
        Shaping clear visual interfaces for thoughtful digital products and the people who use them.
      </MonoText>
      <h2 data-gl-text className="ux-title font-display text-[78px] font-light uppercase leading-[84px] tracking-[-3.12px] text-white max-[874px]:!leading-[75px]">
        UX/UI
      </h2>
    </div>
  );
}

export function ResponsiveProductDesignerIntro() {
  return (
    <div className="flex w-full flex-col items-start text-white">
      <h2 data-gl-text className="product-title mb-[-16px] w-full font-buffon text-[84px] font-normal uppercase leading-[85px] text-white max-[874px]:!mb-[-10px]">
        Product
      </h2>
      <div className="product-service-row flex w-full flex-col items-start whitespace-nowrap min-[601px]:flex-row">
        <div className="product-service-list order-2 flex flex-col pt-4 font-jakarta text-base font-normal uppercase leading-[25px] text-white min-[601px]:order-1">
          <span className="inline-block whitespace-nowrap">/ Web</span>
          <span className="inline-block whitespace-nowrap">/ Graphic</span>
          <span className="inline-block whitespace-nowrap">/ identity</span>
        </div>
        <h2 data-gl-text className="designer-title order-1 mt-[8px] w-fit font-display text-[78px] font-light uppercase leading-[84px] tracking-[-3.12px] text-white max-[874px]:!mt-0 max-[874px]:!leading-[75px]">
          Designer
        </h2>
      </div>
    </div>
  );
}

export function ProductIntro() {
  return (
    <section className="hidden h-[592px] w-full flex-col items-start py-[72px] min-[1199px]:flex">
      <div className="flex h-[158px] w-full flex-col gap-10 pb-1 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <Display className="lg:tracking-[-6.72px]" webglHero>UX/UI</Display>
        <div className="flex w-[286px] max-w-full flex-col items-start gap-[42px] lg:h-[75px] lg:w-[359px] lg:gap-0 lg:pr-8 lg:pt-1">
          <MonoText className="w-full max-w-[327px] font-normal">
            Shaping clear visual interfaces for thoughtful digital products and the people who use them.
          </MonoText>
        </div>
      </div>
      <div className="product-intro-heading-stack flex w-full flex-col items-start text-white">
        <Display buffon webglHero className="product-intro-product-heading">
          Product
        </Display>
        <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-start lg:gap-[194px]">
          <div className="order-2 flex flex-row gap-4 pt-0 font-jakarta text-base font-normal uppercase leading-[25px] text-white lg:order-1 lg:flex-col lg:gap-0 lg:pt-4">
            <span className="inline-block whitespace-nowrap">/ Web</span>
            <span className="inline-block whitespace-nowrap">/ Graphic</span>
            <span className="inline-block whitespace-nowrap">/ identity</span>
          </div>
          <Display webglHero className="product-intro-designer-heading order-1 lg:order-2 lg:tracking-[-6.72px]">Designer</Display>
        </div>
      </div>
    </section>
  );
}
