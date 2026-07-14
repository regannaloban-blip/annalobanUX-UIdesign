import React from "react";
import { Button, Display, MonoText } from "../components/PortfolioPrimitives.jsx";

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
          <h2 className="purpose-tablet-display purpose-tablet-digital w-[437px] whitespace-nowrap text-right font-display text-[126px] font-light uppercase leading-[136px] tracking-[-5.04px] text-white">
            digital
          </h2>
          <div className="pt-1">
            <PurposeMiniText webglHero />
          </div>
        </div>
        <h2 className="purpose-tablet-display purpose-tablet-design mt-[-14px] h-[136px] w-full whitespace-nowrap text-left font-display text-[126px] font-light uppercase leading-[136px] tracking-[-5.04px] text-white">
          design with
        </h2>
        <h2 className="purpose-tablet-buffon h-[122px] w-[544px] whitespace-nowrap font-buffon text-[132px] font-normal uppercase leading-[122px] text-white">
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
        <div className="flex h-[154px] w-full items-center justify-center">
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

export function Purpose() {
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
