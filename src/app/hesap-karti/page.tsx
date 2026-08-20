"use client";

import { useEffect, useSyncExternalStore } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedHighlight from "@/components/AnimatedHighlight";
import AnimatedNumber from "@/components/AnimatedNumber";
import Reveal, { RevealItem } from "@/components/Reveal";
import DebitHero from "./Hero";
import DeliverySteps from "./DeliverySteps";
import AbroadCollage from "./AbroadCollage";
import SanalCard from "./SanalCard";
import CardHandoff from "./CardHandoff";
import TransferIllustration from "./illustrations/TransferIllustration";
import AtmIllustration from "./illustrations/AtmIllustration";
import { DEBIT_EARN, DEBIT_CAPS, DEBIT_ABROAD } from "@/data/content";
import "@/styles/product-page.css";
import "./debit-current.css";

/* ?hero=field — the ONE remaining comparison variant on this page (owner,
   2026-08-20: "we might change the hero layout following the work on credit
   card so keep it for now"). It renders the hero as a contained dark panel
   instead of the locked white "kart xl" field — Figma 22302:68096, and it
   swaps the video master too, because the white hero's multiply knockout would
   erase the card against dark. See `.dpc-hero--field` in debit-current.css and
   the `field` prop in Hero.tsx.
   No picker UI, link-only. Read via useSyncExternalStore so the server snapshot
   is null → default layout, reconciled after hydration without a mismatch
   (HeroVariants pattern).
   Delete path when the credit-card work settles it: this param, the
   `.dpc-hero--field` rules, the `field` prop, and the dual-source `key` in
   Hero.tsx.

   ?earn=bento and ?steps=compact were deleted 2026-08-20 — both decisions were
   settled and the losing layouts were 350 lines of scaffolding a frontend
   developer could not tell apart from live code. */
const subscribeNoop = () => () => {};
/* server snapshot — keeps `window` untouched during SSR */
const getServerParam = () => null;
const getHeroParam = () => new URLSearchParams(window.location.search).get("hero");

export default function HesapKartiDetail() {
  const heroParam = useSyncExternalStore(subscribeNoop, getHeroParam, getServerParam);
  // Add body class on mount, cleanup on unmount
  useEffect(() => {
    document.body.classList.add("dpc");
    return () => {
      document.body.classList.remove("dpc");
    };
  }, []);

  return (
    <>
      <Header variant="inner" />
      <main className="dpc">
        {/* ============ 1. HERO — "kart xl" ============ */}
        <DebitHero field={heroParam === "field"} />

        {/* ============ 2. EARN ============ */}
        <section className="dpc-earn">
          <div className="dpc-container">
            <Reveal as="header" className="dpc-earn__head">
              <h2 className="dpc-title">
                {DEBIT_EARN.title}{" "}
                <AnimatedHighlight type="hl">{DEBIT_EARN.titleHl}</AnimatedHighlight>
              </h2>
              <p className="dpc-earn__sub">{DEBIT_EARN.sub}</p>
            </Reveal>
            <Reveal className="dpc-earn__v2" stagger={0.08}>
              {/* lead row — broadest promise (all physical spend) goes first */}
              <RevealItem as="article" className="dpc-earn__card dpc-earn__card--iade">
                <p className="dpc-earn__copy">
                  {DEBIT_EARN.iade.pre}
                  <span className="dpc-earn__em">{DEBIT_EARN.iade.em}</span>
                  {DEBIT_EARN.iade.post}
                </p>
                <div className="dpc-earn__media">
                  {/* Owner's 3x export (1824x1320, 2026-08-03). Converted to jpeg:
                      it's a photograph and the CSS rounds the corners, so the baked
                      transparency is redundant — 626KB vs 3.7MB as png. */}
                  <img
                    src="/assets/img/debit-earn-photo.jpg"
                    alt=""
                    width={1824}
                    height={1320}
                    loading="lazy"
                  />
                </div>
              </RevealItem>
              <RevealItem as="article" className="dpc-earn__card dpc-earn__card--getirpara">
                <p className="dpc-earn__copy">
                  {DEBIT_EARN.getirpara.pre}
                  <span className="dpc-earn__em">{DEBIT_EARN.getirpara.em}</span>
                  {DEBIT_EARN.getirpara.post}
                </p>
                <div className="dpc-earn__media">
                  {/* Owner re-export, 2026-08-10, replacing the 1920×1104 3x one.
                      It fixes the clipped shadow at the BOTTOM — alpha insets are
                      now T0 B24 L124 R129, where the old file ran hard to every
                      edge (T0 B0).
                      ⚠ Two things to check on it:
                      1. It is 640×411, and this slot renders ~627px wide — i.e.
                         effectively 1x. On a 2x display the phone UI (which is full
                         of small text) will read soft. Wants a 2x/3x re-export at
                         the same framing.
                      2. The TOP is still flush (T0), so the top of the art is still
                         cropped in the file; only the bottom gained padding.
                      Aspect moved 1.739 → 1.557, so `contain` is now height-bound
                      and seats it ~588px wide in the cell instead of filling it. */}
                  <img
                    src="/assets/img/debit-earn-phone.png"
                    alt=""
                    width={640}
                    height={411}
                    loading="lazy"
                  />
                </div>
              </RevealItem>
              <RevealItem as="article" className="dpc-earn__card dpc-earn__card--abonelik">
                <p className="dpc-earn__copy">
                  {DEBIT_EARN.abonelik.pre}
                  <span className="dpc-earn__em">{DEBIT_EARN.abonelik.em}</span>
                  {DEBIT_EARN.abonelik.post}
                </p>
                <div className="dpc-earn__media">
                  {/* Owner-supplied replacement (2026-08-10), and it closes the
                      clearance question open since 2026-08-03: the third-party
                      marks are REFUSED, not pending ("we can't use the logos").
                      This art reproduces nothing identifiable — a faded app screen
                      behind a crisp getirfinans cashback notification, on a violet
                      glow. Two versions landed within the hour; this is the second
                      (1920×1080), which dropped the first's coloured app squircles
                      entirely. `contain` absorbs the aspect change (1.739 → 2.0 →
                      1.778) so no CSS moved for either.
                      ⚠ The art no longer depicts subscriptions at all, while the
                      copy still names spotify / amazon prime / chatgpt — the
                      benefit now lives entirely in the text. Worth a look.
                      No % bubble (AGENTS.md reserves % for faiz) and no coin badge. */}
                  <img
                    src="/assets/img/debit-earn-platforms.png"
                    alt=""
                    width={1920}
                    height={1080}
                    loading="lazy"
                  />
                </div>
              </RevealItem>
            </Reveal>
          </div>
        </section>

        {/* ============ 3. DELIVERY — scroll-driven "dakikalar" sequence ============ */}
        <DeliverySteps />

        {/* ============ 4. SANAL KART — own dark section (distinct product) ============ */}
        <SanalCard />

        {/* ============ 5. ABROAD ============ */}
        <section className="dpc-abroad">
          <div className="dpc-container">
            <Reveal as="header">
              <h2 className="dpc-title dpc-abroad__title">
                {DEBIT_ABROAD.title}
                <br />
                <AnimatedHighlight type="hl">{DEBIT_ABROAD.titleHl}</AnimatedHighlight>
              </h2>
            </Reveal>
            {/* Shares `.dpc-points` with the sanal list — icon-over-text items that
                differ only in skin (CMO round 2026-08-05).
                Card split per Figma 22200:16954 (owner, 2026-08-11) is entirely in
                CSS: each `.dpc-point` is now its own tinted card rather than a cell
                in a shared lilac panel, so this markup is unchanged. The
                `--dpc-points-n` inline style that used to be here is gone with it —
                it drove the grid's column count, and a flex row of fixed-width cards
                derives that from the DOM. That also means the still-pending third
                abroad benefit from product needs no CSS change: adding it to
                content.ts adds a third card. */}
            <Reveal as="ul" className="dpc-points dpc-abroad__captions" stagger={0.06}>
              {DEBIT_ABROAD.captions.map((caption) => (
                <RevealItem as="li" className="dpc-point" key={caption.text}>
                  {caption.icon && (
                    <span className="dpc-point__ic" aria-hidden="true">
                      <img src={`/assets/icons/${caption.icon}`} alt="" width={40} height={40} />
                    </span>
                  )}
                  <p>{caption.text}</p>
                </RevealItem>
              ))}
            </Reveal>
            <AbroadCollage />
          </div>
        </section>

        {/* sanal→abroad card traveler (fixed overlay, desktop scrub only) */}
        <CardHandoff />

        {/* ============ 6. CAPABILITIES — transfers / ATM ("daha neler var?", moved to
            page bottom per review feedback 2026-07-24) ============ */}
        <section className="dpc-caps">
          <div className="dpc-container">
            <Reveal as="header" className="dpc-caps__head">
              <h2 className="dpc-title">
                {DEBIT_CAPS.title}{" "}
                <AnimatedHighlight type="hl">{DEBIT_CAPS.titleHl}</AnimatedHighlight>
              </h2>
            </Reveal>
            <Reveal className="dpc-caps__row" stagger={0.08}>
              <RevealItem as="article" className="dpc-cap dpc-cap--transfer">
                <div className="dpc-cap__copy">
                  <span className="dpc-cap__stat">{DEBIT_CAPS.transfer.stat}</span>
                  <h3>{DEBIT_CAPS.transfer.title}</h3>
                  <p>{DEBIT_CAPS.transfer.sub}</p>
                </div>
                <div className="dpc-cap__media" aria-hidden="true">
                  <TransferIllustration />
                </div>
              </RevealItem>
              <RevealItem as="article" className="dpc-cap dpc-cap--atm">
                <div className="dpc-cap__copy">
                  <AnimatedNumber className="dpc-cap__stat" value={DEBIT_CAPS.atm.stat} />
                  <h3>{DEBIT_CAPS.atm.title}</h3>
                  <p>{DEBIT_CAPS.atm.sub}</p>
                </div>
                <div className="dpc-cap__media" aria-hidden="true">
                  <AtmIllustration />
                </div>
              </RevealItem>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
