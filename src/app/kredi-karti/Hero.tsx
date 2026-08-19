"use client";

import Reveal from "@/components/Reveal";
import ProductHero from "@/components/ProductHero";
import CardMock from "./CardMock";
import { CREDIT_HERO } from "@/data/content";

/* GFDES-2243 hero — first draft, 2026-08-19.

   Copy column comes from <ProductHero>, so badge → title → sub → CTA and the
   measured 29/29/55 ink rhythm are identical to /hesap-karti by construction
   rather than by re-typing them.

   This fixes three defects measured on the LIVE page:
     1. the headline overlapped the card video by 44×47px (both z-index auto,
        so the stacking was paint order, not a layer) — here the copy sits in
        `.dpc-hero__text` and the media is right-anchored, they never meet;
     2. there was no CTA above the fold — `kart al` is now in the hero;
     3. the desktop `<h1>` was `display:none` (mobile-only variant) and the
        visible headline was a `<p>` — <ProductHero> renders one real `<h1>`.

   No DialKit here. The debit hero's dials exist because its card geometry was
   mid-tuning during a 10/10 pass; this card is a placeholder mock, so tunable
   geometry would be tuning the wrong object. Add dials when the real render
   lands, if it needs them. */

function Bolt() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="w-5 h-5">
      <path d="M11 2 4.5 11h4L9 18l6.5-9h-4L11 2z" fill="currentColor" />
    </svg>
  );
}

export default function CreditHero() {
  return (
    <ProductHero
      className="ckp-hero"
      badge={CREDIT_HERO.badge}
      badgeIcon={<Bolt />}
      title={
        <>
          {CREDIT_HERO.title}
          <br />
          {CREDIT_HERO.titleHl}
        </>
      }
      sub={CREDIT_HERO.sub}
      cta={CREDIT_HERO.cta}
      media={
        <div className="dpc-hero__card ckp-hero__card" aria-hidden="true">
          <Reveal direction="none" delay={0.2} className="ckp-hero__media-fill">
            <CardMock />
          </Reveal>
        </div>
      }
    />
  );
}
