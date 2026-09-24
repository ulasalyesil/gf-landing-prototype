"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";
import { MotionConfig } from "motion/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductSubnav from "@/components/ProductSubnav";
import ProductHero, { renderHeroTitle } from "@/components/ProductHero";
import SectionHead from "@/components/SectionHead";
import BenefitTile from "@/components/BenefitTile";
import FaqCarousel from "@/components/FaqCarousel";
import Reveal, { RevealItem } from "@/components/Reveal";
import Delivery from "./Delivery";
import Sanal from "./Sanal";
import { GetirparaVisual, AbonelikVisual, CashbackVisual, FxVisual } from "./visuals";
import { DEBIT_HERO, DEBIT_BENEFITS, DEBIT_ABROAD, DEBIT_FAQ } from "@/data/content";
import "@/styles/product-page.css";
import "./debit.css";

/* GFDES-2174 — /hesap-karti, card pages v2 (Figma 22630:16190, 2026-09-23).
   Replaces the 2026-07 → 08 page (video hero, pinned lilac steps band, dark
   sanal section, abroad collage with the card handoff flight, 7/24 + ATM
   caps). Those files are in git history; the scroll-scrub ENGINE lives on in
   Delivery.tsx.

   Spine: sub-nav → hero → kart avantajları (bento) → hızlı kart teslimatı
   (scroll scrub) → sanal kart → kart avantajları (abroad bento) → sss →
   footer. Shared pieces are in src/components + product-page.css; this
   page's own are in this folder + debit.css.

   `.dpc` on <body> is what the shared chrome hangs off (footer background,
   hamburger colour) — same as /kredi-karti. */

const I = "/assets/img/hesap-karti";

const TITLE_ICONS = {
  calendar: (
    <span className="dpc-hero__icon" style={{ "--icon-h": "0.9em", "--icon-y": "-0.16em" } as CSSProperties}>
      <img src={`${I}/hero-icon-calendar.svg`} alt="" width={62.72} height={58.24} />
    </span>
  ),
  card: (
    <span className="dpc-hero__icon dpc-hero__icon--rot" style={{ "--icon-y": "-0.24em" } as CSSProperties}>
      <img src={`${I}/hero-icon-card.svg`} alt="" width={72.4041} height={64.2542} />
    </span>
  ),
};

export default function DebitPage() {
  useEffect(() => {
    document.body.classList.add("dpc");
    return () => {
      document.body.classList.remove("dpc");
    };
  }, []);

  const B = DEBIT_BENEFITS;
  const X = DEBIT_ABROAD;

  return (
    <>
      <Header variant="inner" />
      {/* reduced motion: transform/layout animations become instant, opacity
          fades stay — gentler, not zero. Reveal and the scrub handle their own.
          Scoped to <main> so the shared header behaves exactly as on the landing. */}
      <MotionConfig reducedMotion="user">
      <main className="dpc dbc">
        <ProductSubnav current="kartlar" />

        {/* ============ 1. HERO ============ */}
        <ProductHero
          badge={DEBIT_HERO.badge}
          title={renderHeroTitle(DEBIT_HERO.title, TITLE_ICONS)}
          sub={
            <>
              {DEBIT_HERO.sub.muted}
              <em>{DEBIT_HERO.sub.em}</em>
            </>
          }
          cta={DEBIT_HERO.cta}
          ctaHref={DEBIT_HERO.href}
          legal={DEBIT_HERO.legal}
          media={
            <div className="dpc-hero__media dbc-hero__media">
              <img src={DEBIT_HERO.media.src} fetchPriority="high" alt="" width={DEBIT_HERO.media.width} height={DEBIT_HERO.media.height} />
            </div>
          }
        />

        {/* ============ 2. KART AVANTAJLARI ============ */}
        <section className="dpc-section dbc-benefits" aria-labelledby="dbc-benefits-h">
          <div className="dpc-container">
            <SectionHead
              eyebrow={B.eyebrow}
              eyebrowClassName="dbc-eyebrow--regular"
              title={B.title}
              sub={B.sub}
              titleId="dbc-benefits-h"
            />
            <Reveal className="dpc-bento" stagger={0.08}>
              <BenefitTile className="dbc-tile-gp" visual={<GetirparaVisual />} title={B.getirpara.title} />
              <BenefitTile className="dbc-tile-ab" visual={<AbonelikVisual />} title={B.abonelik.title} />
              <BenefitTile
                photo
                visual={<img className="dpc-tile__zoom" loading="lazy" src="/assets/img/kartlar/benefit-photo.jpg" alt="" width={1300} height={1625} />}
                title={B.iade.title}
              />
            </Reveal>
          </div>
        </section>

        {/* ============ 3. HIZLI KART TESLİMATI ============ */}
        <Delivery />

        {/* ============ 4. SANAL KART ============ */}
        <Sanal />

        {/* ============ 5. KART AVANTAJLARI — yurt dışı ============ */}
        <section className="dbc-abroad" aria-labelledby="dbc-abroad-h">
          <div className="dpc-container">
            <SectionHead eyebrow={X.eyebrow} title={X.title} sub={X.sub} titleId="dbc-abroad-h" />
            <Reveal className="dpc-bento dbc-abroad__bento" stagger={0.08}>
              <div className="dpc-bento__stack">
                <BenefitTile className="dbc-tile-cb" visual={<CashbackVisual />} title={X.cashback} />
                <RevealItem className="dpc-photo">
                  <img src={`${I}/abroad-bridge.jpg`} alt="" width={944} height={688} loading="lazy" />
                </RevealItem>
              </div>
              <RevealItem className="dbc-abroad__card">
                <img src={`${I}/abroad-card.webp`} alt="" width={920} height={1407} loading="lazy" />
              </RevealItem>
              <div className="dpc-bento__stack">
                <RevealItem className="dpc-photo">
                  <img src={`${I}/abroad-berlin.jpg`} alt="" width={944} height={1259} loading="lazy" />
                </RevealItem>
                <BenefitTile className="dbc-tile-fx" visual={<FxVisual />} title={X.fx} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ 6. SSS ============ */}
        <FaqCarousel title={DEBIT_FAQ.title} items={DEBIT_FAQ.items} skin="wide" />
      </main>
      </MotionConfig>
      <Footer variant="inner" />
    </>
  );
}
