"use client";

import React, { Fragment } from "react";
import Reveal, { RevealItem } from "@/components/Reveal";

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
}: ProductHeroProps) {
  return (
    <section className={className ? `dpc-hero ${className}` : "dpc-hero"} style={style}>
      <div className="dpc-container dpc-hero__inner">
        <Reveal className="dpc-hero__text" stagger={0.08}>
          <RevealItem as="span" className="dpc-badge">
            {badgeIcon}
            {badge}
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
        {media && (
          <Reveal className="dpc-hero__media-wrap" delay={0.2}>
            {media}
          </Reveal>
        )}
      </div>
    </section>
  );
}
