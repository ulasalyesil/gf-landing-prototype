"use client";

import React from "react";
import { useDialKit } from "dialkit";
import Reveal, { RevealItem } from "@/components/Reveal";
import { DEBIT_HERO } from "@/data/content";

/* GFDES-2174 hero — "kart xl" (variant C, picked from the round-1 lab):
   white field, the product carries the section at display scale, title
   matches the landing hero scale. Entrance: badge → title → CTA stagger.
   Video plays once and holds its final frame — a perpetual loop next to
   static text pulls the eye forever; one pass presents the card, done.

   Card geometry is dial-tunable (dev only) while the 10/10 pass runs:
   values flow through CSS vars that only the ≥921 rules read, so the
   mobile layout never sees them. Bake into debit-current.css + delete
   the hook once settled (dial defaults == the CSS fallbacks). */

function Bolt() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="w-5 h-5">
      <path d="M11 2 4.5 11h4L9 18l6.5-9h-4L11 2z" fill="currentColor" />
    </svg>
  );
}

export default function DebitHero() {
  const dials = useDialKit("Hero · kart xl", {
    card: {
      size: [740, 520, 1000, 10],
      top: [50, -200, 300, 5],
      right: [-60, -300, 100, 5],
    },
    /* blob rides inside the card box, always centered behind the video —
       only size and blur are tunable; position follows the card */
    blob: {
      size: [680, 300, 1100, 10],
      blur: [90, 0, 200, 5],
    },
  });

  return (
    <section
      className="dpc-hero"
      style={
        {
          "--hero-card-size": `${dials.card.size}px`,
          "--hero-card-top": `${dials.card.top}px`,
          "--hero-card-right": `${dials.card.right}px`,
          "--hero-blob-size": `${dials.blob.size}px`,
          "--hero-blob-blur": `${dials.blob.blur}px`,
        } as React.CSSProperties
      }
    >
      <div className="dpc-container h-full relative">
        <Reveal className="dpc-hero__text" stagger={0.08}>
          <RevealItem as="span" className="dpc-badge">
            <Bolt />
            {DEBIT_HERO.badge}
          </RevealItem>
          <RevealItem>
            {/* no highlight in the hero — the yellow bar is a sub-section device */}
            <h1 className="dpc-hero__title">
              {DEBIT_HERO.title}
              <br />
              {DEBIT_HERO.titleHl}
            </h1>
          </RevealItem>
          <RevealItem>
            <a href="#" className="dpc-cta dpc-hero__cta">
              {DEBIT_HERO.cta}
            </a>
          </RevealItem>
        </Reveal>
        <div className="dpc-hero__card" aria-hidden="true">
          {/* blurred lilac blob — centered behind the video, shows through
              its knocked-out white (multiply). Desktop-only via CSS. */}
          <div className="dpc-hero__blob" />
          <Reveal direction="none" delay={0.2} className="dpc-hero__media-fill">
            <video className="dpc-hero__video" autoPlay muted playsInline>
              <source src="/assets/video/debit-white-bg.mp4" type="video/mp4" />
            </video>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
