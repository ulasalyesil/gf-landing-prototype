"use client";

import React, { Fragment, useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import Reveal, { RevealItem, useMotionOff } from "@/components/Reveal";
import { useStory } from "@/components/useStory";

/* Hero title from content: one array per line; a "@key" segment is an inline
   icon from `icons`. Segments are joined with real spaces (they are also the
   visual gap beside each icon) and lines with one more, so the h1's
   accessible name reads as a sentence, not "dönüşümuhteşem". */
export function renderHeroTitle(lines: string[][], icons: Record<string, React.ReactNode>) {
  return lines.map((segs, li) => (
    <Fragment key={li}>
      {li > 0 && " "}
      <span className="dpc-hero__line">
        {segs.map((s, si) => (
          <Fragment key={si}>
            {si > 0 && " "}
            {s.startsWith("@") ? icons[s.slice(1)] : s}
          </Fragment>
        ))}
      </span>
    </Fragment>
  ));
}

/* Shared product-page hero. Lifted out of `hesap-karti/Hero.tsx` on
   2026-08-18, when /kredi-karti became the second page to need it.

   Card pages v2 (2026-09-23, Figma 22630:15547 / 22630:16218) centre it:
   badge → title → sub → CTA as one 0.08s stagger, then the page's photo
   beneath. Gaps are the comp's auto-layout (48 / 32 / 48, 40 to the photo)
   and live in product-page.css.

   `title` and `sub` are nodes: callers own the line breaks, the inline title
   icons (`.dpc-hero__icon`) and the sub's two-tone split (`<em>` = ink). The
   visual comes in through `media`; wrap a photo in `.dpc-hero__media`. */

/* Motion pass (2026-09-25): the photo arrives as a window opening — the frame
   grows 0.92 → 1 while the picture inside settles 1.12 → 1, over the scroll
   that brings it up to the upper third. Frame scale is a transform on the
   wrapper; the picture's zoom reaches the img through `--hero-zoom`, so the
   page's own crop (object-position) is untouched. Motion off: both at rest. */
function HeroGrow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const off = useMotionOff();
  const on = useMotionValue(0);
  useEffect(() => {
    on.set(off ? 0 : 1);
  }, [off, on]);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const scale = useTransform(() => (on.get() ? 0.92 + 0.08 * p.get() : 1));
  const zoom = useTransform(() => (on.get() ? 1.12 - 0.12 * p.get() : 1));
  return (
    <motion.div ref={ref} className="dpc-hero__grow" style={{ scale, "--hero-zoom": zoom } as never}>
      {children}
    </motion.div>
  );
}

/* Scroll story (Web comp storyboard 372:5175, 2026-10-16) — three states:
     1. rest: the comp — copy above, the photo inset (1728, radius 64);
     2. the photo opens to the full width (clip inset → 0, radius → 0) while
        the copy slides down onto its centre and turns white (the CTA
        inverts), a soft scrim rising behind it;
     3. scrolling on, the photo zooms ~7% and the copy drifts down at about
        half the scroll's pace, clipped by the photo's lower edge.
   The frame is always full-bleed; its rest look is a clip-path, so every
   CSS variable's default IS the comp (SSR, ≤767, reduced motion: still).
   JS only writes --hs-a (phase 1→2, 0–1), --hs-on (white-ness, 0–1),
   --hero-zoom, and the copy's y / bottom clip. Geometry is measured, not
   assumed, so it holds at every width and on both card pages. */
type Geom = { T: number; LA: number; textTop: number; textH: number; photoBottom: number };
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function useHeroStory(enabled: boolean) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const geom = useMotionValue<Geom>({ T: 0, LA: 1, textTop: 0, textH: 0, photoBottom: 0 });
  const on = useMotionValue(0);

  useEffect(() => {
    on.set(enabled ? 1 : 0);
    const sec = sectionRef.current;
    const text = textRef.current;
    const media = mediaRef.current;
    if (!enabled || !sec || !text || !media) return;
    // layout offset from the section (transforms — the Reveal entrance, the
    // story itself — don't move offsetTop, so this is the rest geometry)
    const topIn = (el: HTMLElement) => {
      let y = 0;
      for (let n: HTMLElement | null = el; n && n !== sec; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
      return y;
    };
    const measure = () => {
      const textTop = topIn(text);
      const textH = text.offsetHeight;
      const photoTop = topIn(media);
      const photoH = media.offsetHeight;
      const docTop = sec.getBoundingClientRect().top + window.scrollY;
      geom.set({
        T: photoTop + photoH / 2 - (textTop + textH / 2),
        // phase 1 ends as the photo's top meets the fixed header (storyboard
        // state 2: the opened photo sits right under the nav)
        LA: Math.max(240, docTop + photoTop - (document.querySelector("header")?.offsetHeight ?? 72)),
        textTop,
        textH,
        photoBottom: photoTop + photoH,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sec);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [enabled, geom, on]);

  const { scrollY } = useScroll();
  // a light spring: wheel steps glide instead of stepping
  const y = useSpring(scrollY, { stiffness: 420, damping: 48, mass: 0.6 });
  // every source is read on every run (the function form tracks what it reads)
  const a = useTransform(() => {
    const v = y.get(), g = geom.get(), live = on.get();
    return live ? smooth(clamp01(v / g.LA)) : 0;
  });
  const b = useTransform(() => {
    const v = y.get(), g = geom.get(), live = on.get();
    return live ? Math.max(0, v - g.LA) : 0;
  });
  const white = useTransform(a, (v) => clamp01((v - 0.3) / 0.5));
  const zoom = useTransform(b, (v) => 1 + 0.07 * clamp01(v / 700));
  const textY = useTransform(() => a.get() * geom.get().T + b.get() * 0.55);
  // the copy never shows below the photo's lower edge
  const clip = useTransform(() => {
    const g = geom.get(), ty = textY.get(), live = on.get();
    const over = g.textTop + ty + g.textH - g.photoBottom;
    return live && over > 0 ? `inset(0 0 ${over}px 0)` : "none";
  });
  return {
    sectionRef,
    textRef,
    mediaRef,
    sectionStyle: { "--hs-a": a, "--hs-on": white, "--hero-zoom": zoom } as Record<string, unknown>,
    textStyle: { y: textY, clipPath: clip },
  };
}

/* One sheen across the badge text once the title's icons have played. */
function BadgeText({ children }: { children: React.ReactNode }) {
  const scope = useStory<HTMLSpanElement>(
    [[".dpc-badge__text", { backgroundPositionX: ["100%", "0%"] }, { duration: 1.1, ease: [0.45, 0, 0.2, 1] }]],
    { delay: 1.5, amount: 1, hoverTarget: "self", rewind: 0 }
  );
  return (
    <span ref={scope} className="dpc-badge__in">
      <span className="dpc-badge__text">{children}</span>
    </span>
  );
}

export interface ProductHeroProps {
  /** Small pill above the title. Optional icon renders inside it, before the text. */
  badge: React.ReactNode;
  badgeIcon?: React.ReactNode;
  title: React.ReactNode;
  sub: React.ReactNode;
  cta: React.ReactNode;
  ctaHref?: string;
  /** Legal footnote for any claim in the badge/title/sub. Omitted when the
      section makes no qualifying claim, same as HeroOffer.legal on the landing. */
  legal?: string;
  /** The page's hero visual, rendered under the copy. */
  media?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** the Web-comp scroll story (photo opens full-bleed, copy lands on it) */
  story?: boolean;
}

export default function ProductHero({
  badge,
  badgeIcon,
  title,
  sub,
  cta,
  ctaHref = "#",
  legal,
  media,
  className,
  style,
  story = false,
}: ProductHeroProps) {
  const off = useMotionOff();
  const { sectionRef, textRef, mediaRef, sectionStyle, textStyle } = useHeroStory(story && !off);
  const cls = ["dpc-hero", story && "dpc-hero--story", className].filter(Boolean).join(" ");
  return (
    <motion.section ref={sectionRef} className={cls} style={(story ? { ...style, ...sectionStyle } : style) as never}>
      <div className="dpc-container dpc-hero__inner">
        <motion.div ref={textRef} className="dpc-hero__text-wrap" style={story ? textStyle : undefined}>
        <Reveal className="dpc-hero__text" stagger={0.08}>
          <RevealItem as="span" className="dpc-badge">
            {badgeIcon}
            <BadgeText>{badge}</BadgeText>
          </RevealItem>
          <div className="dpc-hero__copy">
            <RevealItem>
              <h1 className="dpc-hero__title">{title}</h1>
            </RevealItem>
            <RevealItem>
              <p className="dpc-hero__sub">{sub}</p>
            </RevealItem>
          </div>
          <RevealItem>
            <a href={ctaHref} className="dpc-cta dpc-hero__cta">
              {cta}
            </a>
          </RevealItem>
          {/* after the CTA: it qualifies the offer, it is not part of the pitch */}
          {legal && (
            <RevealItem as="p" className="dpc-hero__legal">
              {legal}
            </RevealItem>
          )}
        </Reveal>
        </motion.div>
        {media &&
          (story ? (
            // the frame is full-bleed; its rest inset is a clip-path (CSS)
            <Reveal className="dpc-hero__media-wrap" delay={0.2}>
              <div ref={mediaRef} className="dpc-hero__frame">
                {media}
                <span className="dpc-hero__scrim" aria-hidden="true" />
              </div>
            </Reveal>
          ) : (
            <Reveal className="dpc-hero__media-wrap" delay={0.2}>
              <HeroGrow>{media}</HeroGrow>
            </Reveal>
          ))}
      </div>
    </motion.section>
  );
}
