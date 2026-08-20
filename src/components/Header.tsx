"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import clsx from "clsx";
import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import Button from "./Button";
import { NAV } from "@/data/content";
import type { NavCategory, NavItem } from "@/data/content";

/* Both header surfaces render from NAV (src/data/content.ts):
   - ≥921px: the nav bar. Categories with items open the mega dropdown; the rest
     are plain links. (Previously every category opened the same product grid.)
   - ≤920px: a full-screen menu listing all three categories as peer rows, with
     "ürünler" as a disclosure. 920 is the menu's breakpoint everywhere — it's where
     .nav hides — so the JS media query and the CSS block agree. */

const COMPACT_MQ = "(max-width: 920px)";
/** Matches --dropdown-close-dur in base.css. */
const CLOSE_DUR = 150;
/* Under the 300ms UI ceiling — this is a tap response, not a drawer. */
const DISCLOSURE_SPRING = { type: "spring", duration: 0.28, bounce: 0 } as const;
const ICON_TRANSITION = { duration: 0.18, ease: [0.23, 1, 0.32, 1] } as const;
/* Rotate about the icon's centre (12,12), not each bar's own bbox. */
const ICON_LINE = { transformBox: "view-box", transformOrigin: "center" } as const;

/* Named states, not a bare animate={{height}} with initial={false} — Motion has no
   baseline to animate *from* in that form and the first toggle silently no-ops
   ("animating opacity from undefined"). Height only; a fade on top of the collapse
   just muddies it. */
const disclosureVariants: Variants = {
  open: { height: "auto" },
  closed: { height: 0 },
};

interface HeaderProps {
  /** "home": white nav over the dark landing hero, flips on scroll.
      "inner": ink nav + purple logo from the start, for light-hero pages
      (uses the .site-header--inner styles ported from the vanilla build). */
  variant?: "home" | "inner";
}

/* True at the hamburger breakpoint. matchMedia is the primary signal (same idiom as
   useMotionOff); the resize listener is belt-and-braces so the mode can never lag the
   viewport — AGENTS.md notes a resize-aware fix already regressed here once. Both are
   cheap and idempotent. Verified: when this flips false while a category is expanded,
   React swaps the motion.div for a plain div and Motion's inline height goes with it,
   so the desktop dropdown can't inherit a clamped height. */
function useCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(COMPACT_MQ);
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update, { passive: true });
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return compact;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function Header({ variant = "home" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  /* Which category is expanded in the compact menu. Everything starts collapsed
     (owner, 2026-07-28) so all three categories fit one screen. "ürünler" used to open
     by default, but with subtexts on its list runs ~1030px — kampanyalar and ücretler
     sat below the fold and were effectively invisible, and campaign discovery is a
     business goal. Costs one tap to reach products; buys two visible categories.
     Survives menu close/reopen, so a deliberate expand isn't undone. */
  const [expanded, setExpanded] = useState<string | null>(null);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  /* The Escape and scroll handlers are bound once; reading state through a ref
     keeps them from closing over a stale isMegaOpen (Escape used to never fire). */
  const openRef = useRef(false);

  const compact = useCompact();
  const reduced = useReducedMotion();

  const closeMega = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setIsMegaOpen(false);
    setIsClosing(true);
    document.body.style.overflow = "";
    setTimeout(() => setIsClosing(false), CLOSE_DUR);
    setActiveMenu(null);
    toggleRef.current?.focus();
  }, []);

  const openMega = useCallback((menuType: string | null) => {
    openRef.current = true;
    setIsClosing(false);
    setIsMegaOpen(true);
    setActiveMenu(menuType);
    if (window.matchMedia(COMPACT_MQ).matches) {
      document.body.style.overflow = "hidden";
    }
  }, []);

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
  }, [isMegaOpen, closeMega]);

  /* Escape to close, and Tab trapped inside the panel while it's open. The trap is
     compact-only: at ≤920px the panel is a modal covering the viewport, so the page
     behind must not be tabbable. The desktop dropdown is not modal — trapping there
     would strand keyboard users who just want to tab past it into the page. */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMega();
        return;
      }
      if (e.key !== "Tab" || !compact || !openRef.current || !megaMenuRef.current) return;

      const panel = megaMenuRef.current;
      const stops = [
        ...(toggleRef.current ? [toggleRef.current] : []),
        ...Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)),
      ].filter((el) => el.offsetParent !== null || el === toggleRef.current);
      if (!stops.length) return;

      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (active === first || !panel.contains(active) && active !== toggleRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeMega, compact]);

  /* Close on page scroll (the desktop dropdown is anchored to the header) and on
     resize. In compact mode the body is locked and the panel's own scrolling doesn't
     reach window, so this doesn't fight the menu. */
  useEffect(() => {
    const handleWindowChange = () => closeMega();
    window.addEventListener("scroll", handleWindowChange, { passive: true });
    window.addEventListener("resize", handleWindowChange, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleWindowChange);
      window.removeEventListener("resize", handleWindowChange);
    };
  }, [closeMega]);

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

  /* In compact mode the panel shows every category; on desktop it's the dropdown for
     whichever category was clicked, so only that one's items render. */
  const panelCategories: NavCategory[] = compact
    ? NAV
    : NAV.filter((cat) => cat.items && cat.id === activeMenu);

  const renderItem = (item: NavItem) => {
    const inner = (
      <>
        <h4>
          {item.label}
          {item.badge && (
            <span className="mega__badge-img">
              <img src={item.badge} alt="yeni" />
            </span>
          )}
        </h4>
        {item.sub && <p dangerouslySetInnerHTML={{ __html: item.sub }} />}
        {item.note && <p className="mega__note">{item.note}</p>}
      </>
    );
    return item.href.startsWith("/") ? (
      <Link className="mega__item" href={item.href} key={item.label} onClick={closeMega}>
        {inner}
      </Link>
    ) : (
      <a className="mega__item" href={item.href} key={item.label} onClick={closeMega}>
        {inner}
      </a>
    );
  };

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
        <div className="header__brand-group">
          <Link href="/" className="brand" aria-label="getirfinans" onClick={closeMega}>
            <img className="brand__logo" src={logoSrc} alt="getirfinans" />
          </Link>
          <a
            href="#"
            className="header__mobile-badge"
            aria-label="#paranaiyibak"
          >
            <img
              className="paranaiyibak__logo"
              src="/assets/logos/paranaiyibak.svg"
              alt="#paranaiyibak"
            />
          </a>
        </div>

        <div className="site-header__col">
          <nav className="nav">
            {NAV.map((cat) =>
              cat.items ? (
                <button
                  key={cat.id}
                  className={clsx("nav__item", activeMenu === cat.id && "is-open")}
                  type="button"
                  aria-expanded={activeMenu === cat.id}
                  aria-controls="megaMenu"
                  onClick={() => handleNavClick(cat.id)}
                >
                  {cat.label}
                </button>
              ) : (
                <a key={cat.id} className="nav__item" href={cat.href} onClick={closeMega}>
                  {cat.label}
                </a>
              )
            )}
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
              ref={toggleRef}
              type="button"
              className={clsx("nav-toggle", isMegaOpen && "is-open")}
              id="navToggle"
              aria-label={isMegaOpen ? "Menüyü kapat" : "Menü"}
              aria-expanded={isMegaOpen}
              aria-controls="megaMenu"
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
                aria-hidden="true"
              >
                {/* Three bars fold into an X. Transforms, not `d` morphing: the bar
                    and diagonal paths use different commands (h vs l), which doesn't
                    interpolate reliably, and transforms stay off the main thread.
                    translate runs first (bar to centre), then rotate about it. */}
                <motion.path
                  d="M4 6h16"
                  style={ICON_LINE}
                  /* explicit initial, same reason as the middle bar's below: without a
                     baseline Motion writes the literal string "undefined" into the SVG
                     transform attribute on first render, which the parser rejects
                     ("<path> attribute transform: Expected transform function"). Two
                     console errors per page load, on every page — this is the shared
                     header. Must match the closed-state target exactly. */
                  initial={{ transform: "rotate(0deg) translateY(0px)" }}
                  animate={{ transform: isMegaOpen ? "rotate(45deg) translateY(6px)" : "rotate(0deg) translateY(0px)" }}
                  transition={reduced ? { duration: 0 } : ICON_TRANSITION}
                />
                <motion.path
                  d="M4 12h16"
                  /* explicit initial — without it Motion has no baseline and warns
                     "animating opacity from undefined", so the first fade no-ops and
                     the middle bar survives into the X */
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isMegaOpen ? 0 : 1 }}
                  transition={{ duration: reduced ? 0 : 0.1 }}
                />
                <motion.path
                  d="M4 18h16"
                  style={ICON_LINE}
                  /* see the first bar — same missing-baseline fix */
                  initial={{ transform: "rotate(0deg) translateY(0px)" }}
                  animate={{ transform: isMegaOpen ? "rotate(-45deg) translateY(-6px)" : "rotate(0deg) translateY(0px)" }}
                  transition={reduced ? { duration: 0 } : ICON_TRANSITION}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mega panel: dropdown on desktop, full-screen menu at ≤920px */}
      <div
        ref={megaMenuRef}
        className={clsx("mega", isMegaOpen && "is-open", isClosing && "is-closing")}
        id="megaMenu"
        role={compact ? "dialog" : undefined}
        aria-modal={compact ? true : undefined}
        aria-label={compact ? "Menü" : undefined}
        // inert (not just aria-hidden) so the links leave the tab order when closed
        inert={!isMegaOpen}
      >
        <div className="container">
          {panelCategories.map((cat) => {
            if (!cat.items) {
              return (
                /* no chevron — it's reserved for the disclosure, so it means
                   "this expands" rather than just "this is tappable" */
                <a key={cat.id} className="mega__cat-link" href={cat.href} onClick={closeMega}>
                  {cat.label}
                </a>
              );
            }
            const open = !compact || expanded === cat.id;
            return (
              <div className="mega__cat" key={cat.id}>
                <button
                  type="button"
                  className={clsx("mega__cat-head", open && "is-open")}
                  aria-expanded={open}
                  aria-controls={`megaCat-${cat.id}`}
                  onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
                >
                  {cat.label}
                  <span className="mega__chev mega__chev--toggle" aria-hidden="true" />
                </button>
                {compact ? (
                  <motion.div
                    id={`megaCat-${cat.id}`}
                    className="mega__cat-body"
                    variants={disclosureVariants}
                    initial={open ? "open" : "closed"}
                    animate={open ? "open" : "closed"}
                    transition={reduced ? { duration: 0 } : DISCLOSURE_SPRING}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="mega__grid">{cat.items.map(renderItem)}</div>
                  </motion.div>
                ) : (
                  <div id={`megaCat-${cat.id}`} className="mega__cat-body">
                    <div className="mega__grid">{cat.items.map(renderItem)}</div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="mega__actions">
            {/* Dev only: doubles as the subtext toggle, because DialKit's panel is
                unusable on a phone and this call needs judging on a real device.
                In production no handler is attached and it's an ordinary brand link
                — never ship a brand mark that does something else when tapped. */}
            <a
              href="#"
              className="paranaiyibak"
              aria-label="#paranaiyibak"
            >
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
