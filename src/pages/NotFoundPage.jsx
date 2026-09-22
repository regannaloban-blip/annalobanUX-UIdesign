import React from "react";

export function NotFoundPage() {
  return (
    <main className="min-h-screen bg-black px-5 py-10 font-jakarta uppercase text-white md:px-[49px]">
      <p className="text-[13px] text-white/50">404</p>
      <h1 className="mt-12 font-display text-[clamp(64px,12vw,160px)] font-light leading-none tracking-[-0.07em]">Page not found</h1>
      <a className="mt-12 inline-flex border border-white px-6 py-4 text-sm font-bold" href="/">Back to portfolio</a>
    </main>
  );
}
