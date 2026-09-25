"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductSubnav from "@/components/ProductSubnav";
import ProductHero, { renderHeroTitle } from "@/components/ProductHero";
import SectionHead from "@/components/SectionHead";
import BenefitTile from "@/components/BenefitTile";
import FaqCarousel from "@/components/FaqCarousel";
import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";
import { CalendarPercentIcon, ChartIcon, CardIcon } from "@/components/art/HeroIcons";
import { MaximumVisual, TransactionVisual, AidatVisual } from "./visuals";
import TaksitTabs from "./TaksitTabs";
import CampaignSlider from "./CampaignSlider";
import BrandTabs from "./BrandTabs";
import { CREDIT_HERO, CREDIT_BENEFITS, CREDIT_FAQ } from "@/data/content";
import "@/styles/product-page.css";
import "./credit.css";

/* GFDES-2243 — /kredi-karti, card pages v2 (Figma 22630:12072, 2026-09-23).
   Replaces the 2026-08-19 first draft (hero → avantajlar → taksit → sss).

   Spine: sub-nav → hero → kart avantajları (bento) → ücretsiz 3 taksit
   (category tabs) → kampanyalar (slider) → maximum taksit (merchant tabs)
   → sss → footer. Shared pieces (hero, section head, tile, FAQ, sub-nav)
   live in src/components and product-page.css; the page-specific parts are
   in this folder and credit.css.

   `.dpc` on <body> is what the shared chrome hangs off (footer background,
   hamburger colour) — same as /hesap-karti. */

/* inline + animated (src/components/art/HeroIcons.tsx); delays follow reading order */
const TITLE_ICONS = {
  calendar: <CalendarPercentIcon delay={0.8} />,
  chart: <ChartIcon delay={0.95} />,
  card: <CardIcon delay={1.1} />,
};

export default function CreditPage() {
  useEffect(() => {
    document.body.classList.add("dpc");
    return () => {
      document.body.classList.remove("dpc");
    };
  }, []);

  const B = CREDIT_BENEFITS;

  return (
    <>
      <Header variant="inner" />
      {/* reduced motion: transform/layout animations become instant, opacity
          fades stay — gentler, not zero. Reveal and the scrub handle their own.
          Scoped to <main> so the shared header behaves exactly as on the landing. */}
      <MotionConfig reducedMotion="user">
      <main className="dpc ckp">
        <ProductSubnav current="kartlar" />

        {/* ============ 1. HERO ============ */}
        <ProductHero
          badge={CREDIT_HERO.badge}
          title={renderHeroTitle(CREDIT_HERO.title, TITLE_ICONS)}
          sub={
            <>
              {CREDIT_HERO.sub.muted}
              <em>{CREDIT_HERO.sub.em}</em>
            </>
          }
          cta={CREDIT_HERO.cta}
          ctaHref={CREDIT_HERO.href}
          legal={CREDIT_HERO.legal}
          media={
            <div className="dpc-hero__media ckp-hero__media">
              <img src={CREDIT_HERO.media.src} fetchPriority="high" alt="" width={CREDIT_HERO.media.width} height={CREDIT_HERO.media.height} />
            </div>
          }
        />

        {/* ============ 2. KART AVANTAJLARI ============ */}
        <section className="dpc-section ckp-benefits" aria-labelledby="ckp-benefits-h">
          <div className="dpc-container">
            <SectionHead eyebrow={B.eyebrow} title={B.title} sub={B.sub} titleId="ckp-benefits-h" />
            <Reveal className="dpc-bento" stagger={0.08}>
              <BenefitTile className="ckp-tile-max" visual={<MaximumVisual />} title={B.maximum.title} desc={B.maximum.desc} />
              <div className="dpc-bento__stack">
                <BenefitTile className="ckp-tile-txn" visual={<TransactionVisual />} title={B.getirpara.title} />
                <BenefitTile className="ckp-tile-aidat" visual={<AidatVisual />} title={B.aidat.title} />
              </div>
              <BenefitTile
                photo
                visual={
                  <Parallax zoom={1.12}>
                    <img className="dpc-tile__zoom" loading="lazy" src="/assets/img/kartlar/benefit-photo.jpg" alt="" width={1300} height={1625} />
                  </Parallax>
                }
                title={B.kampanya.title}
                desc={B.kampanya.desc}
              />
            </Reveal>
          </div>
        </section>

        {/* ============ 3. ÜCRETSİZ 3 TAKSİT ============ */}
        <TaksitTabs />

        {/* ============ 4. KAMPANYALAR ============ */}
        <CampaignSlider />

        {/* ============ 5. MAXIMUM TAKSİT ============ */}
        <BrandTabs />

        {/* ============ 6. SSS ============ */}
        <FaqCarousel title={CREDIT_FAQ.title} items={CREDIT_FAQ.items} skin="wide" />
      </main>
      </MotionConfig>
      <Footer variant="inner" />
    </>
  );
}
