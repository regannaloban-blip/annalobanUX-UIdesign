import React from "react";
import { HoverText } from "../components/PortfolioPrimitives.jsx";

export function NotFoundPage() {
  return (
    <section className="flex min-h-screen flex-col items-center px-8 pb-12 pt-[88px] font-jakarta uppercase text-white min-[601px]:pb-[72px] min-[1020px]:px-[49px] min-[1020px]:pt-[173px]">
      <div className="flex w-full max-w-[376px] flex-col items-center gap-8 text-center min-[601px]:max-w-[537px] min-[1020px]:max-w-[560px]">
        <p className="text-base leading-[25px]">404</p>
        <h1 className="font-display text-[38px] font-light leading-[60px] tracking-[-1.52px]">Page not found</h1>
        <p className="text-base leading-[25px]">The page you are looking for doesn’t exist, may have been moved, or is no longer available.</p>
        <a
          data-hover-text-trigger
          className="group relative mt-4 inline-flex h-12 items-center justify-center border-b border-black bg-white px-10 pb-[6px] pt-[2px] text-black active:scale-[0.99]"
          href="/"
        >
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[-2px] hidden h-0 bg-[#A40000] transition-[height] duration-200 ease-out lg:block lg:group-hover:h-0.5" />
          <span className="relative z-10 block whitespace-nowrap font-jakarta text-base font-bold uppercase leading-[25px]">
            <HoverText triggerOnParent>back to home</HoverText>
          </span>
        </a>
      </div>
    </section>
  );
}
