import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HoverText, navigateToHomeSection } from "./PortfolioPrimitives.jsx";
import { TopLinks } from "./TopLinks.jsx";
import annaLogo from "../assets/figma/anna-logo.svg";
import telegramHeaderIcon from "../assets/figma/telegram-header.svg";
import "./HomeNavigation.css";

const menuItems = [
  ["About", "#about"],
  ["Solutions", "#solutions"],
  ["Projects", "#works"],
  ["Contact", "#contact-form"],
];

export function HomeNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const openMenu = () => {
    setIsOpening(true);
    window.setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 240);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <>
      <header className="flex h-8 w-full items-center justify-between font-jakarta text-base font-normal uppercase leading-[25px] text-white min-[601px]:h-[25px]">
        <a href="/" className="inline-flex h-[25px] w-7 shrink-0 items-center" aria-label="Anna Loban home">
          <img src={annaLogo} width="28" height="25" alt="" />
        </a>
        <nav className="hidden items-center gap-10 min-[601px]:flex" aria-label="Primary navigation">
          {menuItems.map(([label, href]) => (
            <a key={label} href={href} className="text-white no-underline" onClick={(event) => navigateToHomeSection(event, href)}>
              <HoverText>{label}</HoverText>
            </a>
          ))}
          <a href="https://t.me/anna_loban" target="_blank" rel="noreferrer" aria-label="Telegram" className="header-telegram inline-flex shrink-0">
            <img src={telegramHeaderIcon} alt="" className="block h-7 w-7" />
          </a>
        </nav>
        <button
          type="button"
          className="grid h-8 w-24 place-items-center bg-white text-black min-[601px]:hidden"
          aria-expanded={isOpen || isOpening}
          aria-controls="home-mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          disabled={isOpening}
          onClick={openMenu}
        >
          <span className={`home-menu-toggle__icon${isOpening ? " home-menu-toggle__icon--opening" : ""}`} aria-hidden="true">
            <span className="block h-[2px] w-full bg-current" />
            <span className="block h-[2px] w-full bg-current" />
            <span className="block h-[2px] w-full bg-current" />
          </span>
        </button>
      </header>
      {isOpen && createPortal(
        <nav id="home-mobile-menu" className="fixed inset-0 z-[1100] flex flex-col bg-[#A40000] px-5 pb-10 pt-4" aria-label="Mobile navigation">
          <div className="flex h-8 items-center justify-between">
            <a href="/" className="inline-flex h-[25px] w-7 items-center" aria-label="Anna Loban home" onClick={() => setIsOpen(false)}>
              <img src={annaLogo} width="28" height="25" alt="" />
            </a>
            <button type="button" className="grid h-8 w-24 place-items-center bg-white text-[#A40000]" aria-label="Close menu" onClick={() => setIsOpen(false)}>
              <span className="block h-[2px] w-[60px] bg-current" aria-hidden="true" />
            </button>
          </div>
          <div className="home-mobile-menu__content">
            <p>Connect everything once,<br />Then automate forever.</p>
            <ol className="home-mobile-menu__items flex list-none flex-col gap-5 p-0">
              {menuItems.map(([label, href], index) => (
                <li key={label}>
                  <a href={href} className="flex items-start gap-3 text-[34px] font-[300] leading-[41px] text-white no-underline" onClick={(event) => { setIsOpen(false); navigateToHomeSection(event, href); }}>
                    <span>{label}</span><sup className="text-sm font-[300] leading-[25px] text-white/50">0{index + 1}</sup>
                  </a>
                </li>
              ))}
            </ol>
          </div>
          <div className="home-mobile-menu__socials"><TopLinks mobileMenu /></div>
        </nav>
      , document.body)}
    </>
  );
}
