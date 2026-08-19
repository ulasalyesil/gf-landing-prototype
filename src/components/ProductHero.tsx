"use client";

import React from "react";
import Reveal, { RevealItem } from "@/components/Reveal";

/* Shared product-page hero — the copy column only.
   Lifted out of `hesap-karti/Hero.tsx` on 2026-08-18, when /kredi-karti became
   the second page to need it.

   The column is badge → title → sub → CTA, entering as one 0.08s stagger. That
   order and that rhythm are the pattern: the landing hero and /hesap-karti both
   use it, and the measured 29/29/55 ink spacing that binds badge+title+sub as
   one block lives in product-page.css.

   Media is NOT handled here. Each page's hero visual has its own geometry,
   blend mode and entrance (debit's is a multiply-knockout video over a blurred
   blob; credit's is a static render), so it comes in through `media` and the
   page styles it in its own stylesheet. `.dpc-hero__card` gives it a base box.

   `style` is passed through for pages driving card geometry with CSS vars
   (debit's DialKit values). */

export interface ProductHeroProps {
  /** Small pill above the title. Optional icon renders inside it, before the text. */
  badge: React.ReactNode;
  badgeIcon?: React.ReactNode;
  /** Node, not string — callers control line breaks (`<br />`) at meaningful points. */
  title: React.ReactNode;
  sub: React.ReactNode;
  cta: React.ReactNode;
  ctaHref?: string;
  /** The page's hero visual. Wrap it in `.dpc-hero__card` unless it needs its own box. */
  media?: React.ReactNode;
  /** Extra section classes — page variants (e.g. `dpc-hero--field`). */
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
  media,
  className,
  style,
}: ProductHeroProps) {
  return (
    <section className={className ? `dpc-hero ${className}` : "dpc-hero"} style={style}>
      <div className="dpc-container h-full relative">
        <Reveal className="dpc-hero__text" stagger={0.08}>
          <RevealItem as="span" className="dpc-badge">
            {badgeIcon}
            {badge}
          </RevealItem>
          <RevealItem>
            {/* no highlight in the hero — the yellow bar is a sub-section device */}
            <h1 className="dpc-hero__title">{title}</h1>
          </RevealItem>
          <RevealItem>
            <p className="dpc-hero__sub">{sub}</p>
          </RevealItem>
          <RevealItem>
            <a href={ctaHref} className="dpc-cta dpc-hero__cta">
              {cta}
            </a>
          </RevealItem>
        </Reveal>
        {media}
      </div>
    </section>
  );
}
