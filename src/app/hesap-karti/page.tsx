"use client";

import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedHighlight from "@/components/AnimatedHighlight";
import Reveal, { RevealItem } from "@/components/Reveal";
import DebitHeroLab from "./HeroVariants";
import DeliverySteps from "./DeliverySteps";
import AbroadCollage from "./AbroadCollage";
import { DEBIT_EARN, DEBIT_CAPS, DEBIT_ABROAD } from "@/data/content";
import "./debit-current.css";

export default function HesapKartiDetail() {
  // Add body class on mount, cleanup on unmount
  useEffect(() => {
    document.body.classList.add("dpc");
    return () => {
      document.body.classList.remove("dpc");
    };
  }, []);

  return (
    <>
      <Header />
      <main className="dpc">
        {/* ============ 1. HERO — GFDES-2174 variant lab ============ */}
        <DebitHeroLab />

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
            <Reveal className="dpc-earn__cards" stagger={0.08}>
              <RevealItem as="article" className="dpc-earn__card dpc-earn__card--iade">
                <img
                  src="/assets/img/debit-earn-photo.png"
                  alt=""
                  width={380}
                  height={520}
                  loading="lazy"
                />
                <p>{DEBIT_EARN.iade}</p>
              </RevealItem>
              <RevealItem as="article" className="dpc-earn__card dpc-earn__card--getirpara">
                <img
                  src="/assets/img/debit-earn-phone.png"
                  alt=""
                  width={380}
                  height={520}
                  loading="lazy"
                />
                <p>
                  {DEBIT_EARN.getirpara.pre}
                  <span className="y">{DEBIT_EARN.getirpara.em}</span>
                  {DEBIT_EARN.getirpara.post}
                </p>
              </RevealItem>
            </Reveal>
          </div>
        </section>

        {/* ============ 3. DELIVERY — scroll-driven "dakikalar" sequence ============ */}
        <DeliverySteps />

        {/* ============ 4. CAPABILITIES — transfers / ATM / sanal ============ */}
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
                  {DEBIT_CAPS.transfer.media}
                </div>
              </RevealItem>
              <RevealItem as="article" className="dpc-cap dpc-cap--atm">
                <div className="dpc-cap__copy">
                  <span className="dpc-cap__stat">{DEBIT_CAPS.atm.stat}</span>
                  <h3>{DEBIT_CAPS.atm.title}</h3>
                  <p>{DEBIT_CAPS.atm.sub}</p>
                </div>
                <div className="dpc-cap__media" aria-hidden="true">
                  {DEBIT_CAPS.atm.media}
                </div>
              </RevealItem>
            </Reveal>
            <Reveal as="article" className="dpc-cap dpc-cap--sanal">
              <div className="dpc-cap__copy">
                <h3>{DEBIT_CAPS.sanal.title}</h3>
                <ul className="dpc-features">
                  {DEBIT_CAPS.sanal.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="dpc-cap__media" aria-hidden="true">
                {DEBIT_CAPS.sanal.media}
              </div>
            </Reveal>
          </div>
        </section>

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
      </main>
      <Footer />
    </>
  );
}
