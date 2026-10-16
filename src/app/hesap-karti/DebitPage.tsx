"use client";

import { Fragment, useEffect } from "react";
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
import Delivery from "./Delivery";
import Sanal from "./Sanal";
import Abroad from "./Abroad";
import Extras from "./Extras";
import { GetirparaVisual, AbonelikVisual } from "./visuals";
import { DEBIT_HERO, DEBIT_BENEFITS, DEBIT_FAQ } from "@/data/content";
import type { CaptionLine } from "@/data/content";
import "@/styles/product-page.css";
import "./debit.css";

/* GFDES-2174 — /hesap-karti. Rebuilt 2026-10-14 to the product-feedback
   Web comp (Figma 5J9ucPVhyd7DCBjTlmLI4h, frame 283:20631, 1920 wide;
   1440 column). The 2026-09 card-pages-v2 version is in git at 65e11be.

   Spine: sub-nav → hero → kart avantajları (bento) → hızlı kart teslimatı
   (card stack + steps, static until the storyboard pass) → sanal kart
   (dark band, card fan) → yurt dışı → daha neler var → sss → footer.
   Shared pieces are in src/components + product-page.css; this page's own
   are in this folder + debit.css.

   `.dpc` on <body> is what the shared chrome hangs off (footer background,
   hamburger colour) — same as /kredi-karti. */

/* Bento caption: each comp paragraph is a block line; `{ b }` is the ink
   emphasis. Real spaces between lines keep the heading's name a sentence. */
function caption(lines: CaptionLine[]) {
  return lines.map((l, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span className="dbc-cap__line">{typeof l === "string" ? l : <b>{l.b}</b>}</span>
    </Fragment>
  ));
}

export default function DebitPage() {
  useEffect(() => {
    document.body.classList.add("dpc");
    return () => {
      document.body.classList.remove("dpc");
    };
  }, []);

  const B = DEBIT_BENEFITS;

  return (
    <>
      <Header variant="inner" />
      {/* reduced motion: transform/layout animations become instant, opacity
          fades stay — gentler, not zero. Reveal and the scrub handle their own.
          Scoped to <main> so the shared header behaves exactly as on the landing. */}
      <MotionConfig reducedMotion="user">
      <main className="dpc dbc dpc--web">
        <ProductSubnav current="kartlar" />

        {/* ============ 1. HERO ============ */}
        <ProductHero
          story
          className="dbc-hero dpc-hero--web"
          badge={DEBIT_HERO.badge}
          title={renderHeroTitle(DEBIT_HERO.title, {})}
          sub={
            <>
              {DEBIT_HERO.sub.muted}
              <em>{DEBIT_HERO.sub.em}</em>
            </>
          }
          cta={DEBIT_HERO.cta}
          ctaHref={DEBIT_HERO.href}
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
              title={B.title}
              sub={B.sub}
              titleId="dbc-benefits-h"
            />
            <Reveal className="dpc-bento dbc-benefits__bento" stagger={0.08}>
              <BenefitTile className="dbc-tile-gp" visual={<GetirparaVisual />} title={caption(B.getirpara.title)} />
              <BenefitTile
                photo
                visual={
                  <Parallax zoom={1.12}>
                    <img className="dpc-tile__zoom" loading="lazy" src="/assets/img/kartlar/benefit-photo.jpg" alt="" width={1300} height={1625} />
                  </Parallax>
                }
                title={caption(B.iade.title)}
              />
              <BenefitTile className="dbc-tile-ab" visual={<AbonelikVisual />} title={caption(B.abonelik.title)} />
            </Reveal>
          </div>
        </section>

        {/* ============ 3. HIZLI KART TESLİMATI ============ */}
        <Delivery />

        {/* ============ 4. SANAL KART ============ */}
        <Sanal />

        {/* ============ 5. YURT DIŞI ============ */}
        <Abroad />

        {/* ============ 6. DAHA NELER VAR ============ */}
        <Extras />

        {/* ============ 7. SSS ============ */}
        <FaqCarousel title={DEBIT_FAQ.title} items={DEBIT_FAQ.items} skin="wide" />
      </main>
      </MotionConfig>
      <Footer variant="inner" />
    </>
  );
}
