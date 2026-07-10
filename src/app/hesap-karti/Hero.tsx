"use client";

import React from "react";
import Reveal, { RevealItem } from "@/components/Reveal";
import { DEBIT_HERO } from "@/data/content";

/* GFDES-2174 hero — "kart xl" (variant C, picked from the round-1 lab):
   white field, the product carries the section at display scale, title
   matches the landing hero scale. Entrance: badge → title → CTA stagger. */

function Bolt() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="w-5 h-5">
      <path d="M11 2 4.5 11h4L9 18l6.5-9h-4L11 2z" fill="currentColor" />
    </svg>
  );
}

export default function DebitHero() {
  return (
    <section className="dpc-hero">
      <div className="dpc-container h-full relative">
        <Reveal className="dpc-hero__text" stagger={0.08}>
          <RevealItem as="span" className="dpc-badge">
            <Bolt />
            {DEBIT_HERO.badge}
          </RevealItem>
          <RevealItem>
            <h1 className="dpc-hero__title">
              {DEBIT_HERO.title}
              <br />
              <span className="hl">{DEBIT_HERO.titleHl}</span>
            </h1>
          </RevealItem>
          <RevealItem>
            <a href="#" className="dpc-cta dpc-hero__cta">
              {DEBIT_HERO.cta}
            </a>
          </RevealItem>
        </Reveal>
        <div className="dpc-hero__card" aria-hidden="true">
          <Reveal direction="none" delay={0.2} className="dpc-hero__media-fill">
            <video className="dpc-hero__video" autoPlay muted loop playsInline>
              <source src="/assets/video/debit-white-bg.mp4" type="video/mp4" />
            </video>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
