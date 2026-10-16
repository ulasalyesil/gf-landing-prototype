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
import { MaximumVisual, AidatVisual } from "./visuals";
import MaximumCarousel from "./MaximumCarousel";
import TaksitGrid from "./TaksitGrid";
import { CREDIT_HERO, CREDIT_BENEFITS, CREDIT_FAQ } from "@/data/content";
import "@/styles/product-page.css";
import "./credit.css";

/* GFDES-2243 — /kredi-karti. Rebuilt 2026-10-16 to the Web comp (Figma
   5J9ucPVhyd7DCBjTlmLI4h, frame 266:4725 "Desktop - 11", 1920 wide; 1440
   column), the credit sibling of /hesap-karti's 283:20631. The card pages
   v2 version is in git history before this change.

   Spine: sub-nav → hero → kart avantajları (3 equal tiles) → maximum taksit
   (dark coverflow) → ücretsiz 3 taksit (photo grid) → sss → footer.
   Per the 2026-09-28 meeting: hero icons, the ₺350 getirpara tile and the
   kampanyalar section are gone; taksit is simpler, maximum more compact.
   ⚠ The meeting also asked for the delivery section here; the comp has
   none, so neither does the page.

   `.dpc` on <body> is what the shared chrome hangs off (footer background,
   hamburger colour) — same as /hesap-karti. */

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
      <main className="dpc ckp dpc--web">
        <ProductSubnav current="kartlar" />

        {/* ============ 1. HERO ============ */}
        <ProductHero
          story
          className="ckp-hero dpc-hero--web"
          badge={CREDIT_HERO.badge}
          title={renderHeroTitle(CREDIT_HERO.title, {})}
          sub={
            <>
              {CREDIT_HERO.sub.muted}
              <em>{CREDIT_HERO.sub.em}</em>
            </>
          }
          cta={CREDIT_HERO.cta}
          ctaHref={CREDIT_HERO.href}
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
            <Reveal className="dpc-bento ckp-benefits__bento" stagger={0.08}>
              <BenefitTile className="ckp-tile-max" visual={<MaximumVisual />} title={B.maximum.title} desc={B.maximum.desc} />
              <BenefitTile className="ckp-tile-aidat" visual={<AidatVisual />} title={B.aidat.title} desc={B.aidat.desc} />
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

        {/* ============ 3. MAXIMUM TAKSİT ============ */}
        <MaximumCarousel />

        {/* ============ 4. ÜCRETSİZ 3 TAKSİT ============ */}
        <TaksitGrid />

        {/* ============ 5. SSS ============ */}
        <FaqCarousel title={CREDIT_FAQ.title} items={CREDIT_FAQ.items} skin="wide" />
      </main>
      </MotionConfig>
      <Footer variant="inner" />
    </>
  );
}
