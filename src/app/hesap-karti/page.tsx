"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedHighlight from "@/components/AnimatedHighlight";
import AnimatedNumber from "@/components/AnimatedNumber";
import Reveal, { RevealItem } from "@/components/Reveal";
import DebitHero from "./Hero";
import DeliverySteps from "./DeliverySteps";
import DeliveryCompact from "./DeliveryCompact";
import AbroadCollage from "./AbroadCollage";
import SanalCard from "./SanalCard";
import CardHandoff from "./CardHandoff";
import TransferIllustration from "./illustrations/TransferIllustration";
import AtmIllustration from "./illustrations/AtmIllustration";
import SubscriptionsMotif from "./illustrations/SubscriptionsMotif";
import { DEBIT_EARN, DEBIT_CAPS, DEBIT_ABROAD } from "@/data/content";
import "./debit-current.css";

/* ?steps=compact swaps the teslimatı section to the compact layout
   (Figma 21619:8182) for team comparison — no picker UI, link-only.
   Read via useSyncExternalStore (server snapshot null → default layout,
   reconciled after hydration without a mismatch — HeroVariants pattern). */
const subscribeNoop = () => () => {};
const getStepsParam = () => new URLSearchParams(window.location.search).get("steps");
/* server snapshot for both param stores — keeps `window` untouched during SSR */
const getServerParam = () => null;

/* ?earn=equal renders the three earn benefits as same-size peer tiles — the
   arrangement all three Figma comps (22054:45003) assume — instead of the
   default unequal bento. Kept as the owner's alternative for on-device
   comparison (owner, 2026-08-03); same link-only, no-picker pattern as ?steps=.
   Once a call is made: delete this param, the loser's container rule in
   debit-current.css, and the ternary on .dpc-earn__bento / .dpc-earn__row. */
const getEarnParam = () => new URLSearchParams(window.location.search).get("earn");

export default function HesapKartiDetail() {
  const stepsParam = useSyncExternalStore(subscribeNoop, getStepsParam, getServerParam);
  const earnParam = useSyncExternalStore(subscribeNoop, getEarnParam, getServerParam);
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
        <DebitHero />

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
            <Reveal
              className={earnParam === "equal" ? "dpc-earn__row" : "dpc-earn__bento"}
              stagger={0.08}
            >
              {/* hero tile — broadest promise (all physical spend) leads */}
              <RevealItem as="article" className="dpc-earn__card dpc-earn__card--iade">
                <p className="dpc-earn__copy">{DEBIT_EARN.iade}</p>
                <div className="dpc-earn__media">
                  <img
                    src="/assets/img/debit-earn-photo.png"
                    alt=""
                    width={720}
                    height={520}
                    loading="lazy"
                  />
                </div>
              </RevealItem>
              <RevealItem as="article" className="dpc-earn__card dpc-earn__card--getirpara">
                <p className="dpc-earn__copy">
                  {DEBIT_EARN.getirpara.pre}
                  <span className="y">{DEBIT_EARN.getirpara.em}</span>
                  {DEBIT_EARN.getirpara.post}
                </p>
                <div className="dpc-earn__media">
                  <img
                    src="/assets/img/debit-earn-phone.png"
                    alt=""
                    width={380}
                    height={520}
                    loading="lazy"
                  />
                </div>
              </RevealItem>
              <RevealItem as="article" className="dpc-earn__card dpc-earn__card--abonelik">
                <p className="dpc-earn__copy">
                  {DEBIT_EARN.abonelik.pre}
                  <span className="y">{DEBIT_EARN.abonelik.em}</span>
                  {DEBIT_EARN.abonelik.post}
                </p>
                <div className="dpc-earn__media">
                  <SubscriptionsMotif className="dpc-earn__motif" />
                  {/* coin is the sanctioned cashback mark (AGENTS.md), not a % bubble */}
                  <img
                    className="dpc-earn__coin"
                    src="/assets/icons/cashback.svg"
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                  />
                </div>
              </RevealItem>
            </Reveal>
          </div>
        </section>

        {/* ============ 3. DELIVERY — scroll-driven "dakikalar" sequence ============ */}
        {stepsParam === "compact" ? <DeliveryCompact /> : <DeliverySteps />}

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
            <Reveal as="ul" className="dpc-abroad__captions" stagger={0.06}>
              {DEBIT_ABROAD.captions.map((caption) => (
                <RevealItem as="li" key={caption}>
                  {caption}
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
