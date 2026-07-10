"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import Button from "./Button";

interface HeaderProps {
  /** "home": white nav over the dark landing hero, flips on scroll.
      "inner": ink nav + purple logo from the start, for light-hero pages
      (uses the .site-header--inner styles ported from the vanilla build). */
  variant?: "home" | "inner";
}

export default function Header({ variant = "home" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Handle header scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle outside clicks to close mega menu
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isMegaOpen &&
        megaMenuRef.current &&
        !megaMenuRef.current.contains(e.target as Node) &&
        !(e.target as Element).closest(".nav__item") &&
        !(e.target as Element).closest("#navToggle")
      ) {
        closeMega();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isMegaOpen]);

  // Handle escape key to close mega menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMega();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mega menu on scroll or resize
  useEffect(() => {
    const handleWindowChange = () => {
      closeMega();
    };
    window.addEventListener("scroll", handleWindowChange, { passive: true });
    window.addEventListener("resize", handleWindowChange, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleWindowChange);
      window.removeEventListener("resize", handleWindowChange);
    };
  }, []);

  const openMega = (menuType: string | null) => {
    setIsClosing(false);
    setIsMegaOpen(true);
    setActiveMenu(menuType);
    if (window.innerWidth <= 920) {
      document.body.style.overflow = "hidden";
    }
  };

  const closeMega = () => {
    if (!isMegaOpen) return;
    setIsMegaOpen(false);
    setIsClosing(true);
    document.body.style.overflow = "";
    setTimeout(() => {
      setIsClosing(false);
    }, 150); // Matches --dropdown-close-dur (150ms)
    setActiveMenu(null);
  };

  const handleNavClick = (menuType: string) => {
    if (activeMenu === menuType) {
      closeMega();
    } else {
      openMega(menuType);
    }
  };

  const handleToggleClick = () => {
    if (isMegaOpen) {
      closeMega();
    } else {
      openMega(null);
    }
  };

  // Determine logo source
  // Inner pages, scrolled, or mega open → purple logo, else white logo
  // over the transparent header
  const showPurpleLogo = variant === "inner" || isScrolled || isMegaOpen;
  const logoSrc = showPurpleLogo
    ? "/assets/logos/getirfinans.svg"
    : "/assets/logos/getirfinans-dark.svg";

  return (
    <header
      className={clsx(
        "site-header",
        variant === "inner" && "site-header--inner",
        isScrolled && "is-scrolled",
        isMegaOpen && "is-mega",
        isClosing && "is-closing"
      )}
      id="siteHeader"
    >
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label="getirfinans" onClick={closeMega}>
          <img className="brand__logo" src={logoSrc} alt="getirfinans" />
        </Link>

        <div className="site-header__col">
          <nav className="nav">
            <button
              className={clsx("nav__item", activeMenu === "urunler" && "is-open")}
              type="button"
              onClick={() => handleNavClick("urunler")}
            >
              ürünler
            </button>
            <button
              className={clsx("nav__item", activeMenu === "kampanyalar" && "is-open")}
              type="button"
              onClick={() => handleNavClick("kampanyalar")}
            >
              kampanyalar
            </button>
            <button
              className={clsx("nav__item", activeMenu === "ucretler" && "is-open")}
              type="button"
              onClick={() => handleNavClick("ucretler")}
            >
              ürün ve hizmet ücretleri
            </button>
          </nav>

          <div className="site-header__actions">
            <a href="#" className="paranaiyibak" aria-label="#paranaiyibak">
              <img
                className="paranaiyibak__logo"
                src="/assets/logos/paranaiyibak.svg"
                alt="#paranaiyibak"
              />
            </a>
            <Button href="#" className="header__cta">
              getirfinanslı ol
            </Button>
            <button
              type="button"
              className="nav-toggle"
              id="navToggle"
              aria-label="Menü"
              onClick={handleToggleClick}
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mega dropdown menu panel */}
      <div
        ref={megaMenuRef}
        className={clsx(
          "mega",
          isMegaOpen && "is-open",
          isClosing && "is-closing"
        )}
        id="megaMenu"
        aria-hidden={!isMegaOpen}
      >
        <div className="container">
          <div className="mega__grid">
            <a className="mega__item" href="#" onClick={closeMega}>
              <h4>hesap</h4>
              <p>
                yıllık <b>%43 faizle</b> her gün kazandıran hesap
              </p>
            </a>
            <Link className="mega__item" href="/hesap-karti" onClick={closeMega}>
              <h4>hesap kartı</h4>
              <p>
                getir’de <b>%3 getirpara</b>, fiziksel harcamalarında{" "}
                <b>%1 nakit iade</b> kazan
              </p>
            </Link>
            <a className="mega__item" href="#" onClick={closeMega}>
              <h4>kredi kartı</h4>
              <p>taksit yapan, kazandıran, aidatsız kredi kartı</p>
            </a>
            <a className="mega__item" href="#" onClick={closeMega}>
              <h4>ihtiyaç kredisi</h4>
              <p>
                <b>%3,09</b>’dan başlayan faiz oranları
              </p>
            </a>
            <a className="mega__item" href="#" onClick={closeMega}>
              <h4>mini kredi</h4>
              <p>
                <b>%3,09</b>’dan başlayan faiz oranları
              </p>
            </a>
            <a className="mega__item" href="#" onClick={closeMega}>
              <h4>kasada kredi</h4>
              <p>
                <b>%3,09</b>’dan başlayan faiz oranları
              </p>
            </a>
            <a className="mega__item" href="#" onClick={closeMega}>
              <h4>avans limit</h4>
              <p>acil ihtiyaçların için yanında</p>
            </a>
            <a className="mega__item" href="#" onClick={closeMega}>
              <h4>
                getirsonraöde{" "}
                <span className="mega__badge-img">
                  <img src="/assets/badges/yeni.svg" alt="yeni" />
                </span>
              </h4>
              <p>
                getir’deki harcamalarını <b>60 güne kadar</b> <b>%0 faiz</b> ile
                erteleme imkanı
              </p>
            </a>
            <a className="mega__item" href="#" onClick={closeMega}>
              <h4>döviz işlemleri</h4>
              <p>dar makas ile avantajlı kurlar</p>
            </a>
            <a className="mega__item" href="#" onClick={closeMega}>
              <h4>ödemeler</h4>
            </a>
          </div>

          <div className="mega__actions">
            <a href="#" className="paranaiyibak" aria-label="#paranaiyibak">
              <img
                className="paranaiyibak__logo"
                src="/assets/logos/paranaiyibak.svg"
                alt="#paranaiyibak"
              />
            </a>
            <Button href="#" onClick={closeMega}>
              getirfinanslı ol
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
