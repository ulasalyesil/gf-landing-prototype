"use client";

import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedHighlight from "@/components/AnimatedHighlight";
import Reveal, { RevealItem } from "@/components/Reveal";
import DebitHeroLab from "./HeroVariants";
import {
  DEBIT_EARN,
  DEBIT_STEPS,
  DEBIT_STEPS_SECTION,
  DEBIT_CAPS,
  DEBIT_ABROAD,
} from "@/data/content";
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

        {/* ============ 3. DELIVERY — "dakikalar" field ============ */}
        <section className="dpc-steps">
          <div className="dpc-container">
            <div className="dpc-steps__top">
              <Reveal className="dpc-steps__intro">
                <h2 className="dpc-title">
                  {DEBIT_STEPS_SECTION.title}{" "}
                  <AnimatedHighlight type="hl">{DEBIT_STEPS_SECTION.titleHl}</AnimatedHighlight>
                </h2>
                <p className="dpc-steps__sub">{DEBIT_STEPS_SECTION.sub}</p>
                <a href="#" className="dpc-cta dpc-steps__cta">
                  {DEBIT_STEPS_SECTION.cta}
                </a>
              </Reveal>
              <Reveal direction="none" className="dpc-steps__phone">
                <img
                  src="/assets/img/debit-phone-tilted.png"
                  alt=""
                  width={285}
                  height={470}
                  loading="lazy"
                />
              </Reveal>
            </div>
            <Reveal as="ol" className="dpc-steps__list" stagger={0.08}>
              {DEBIT_STEPS.map((step, i) => (
                <RevealItem as="li" key={step.title} className="dpc-steps__item">
                  <span className="dpc-steps__num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </RevealItem>
              ))}
            </Reveal>
          </div>
        </section>

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
            <Reveal direction="none" className="dpc-abroad__collage">
              <img
                className="dpc-abroad__img-1"
                src="/assets/img/debit-abroad-1.png"
                alt=""
                width={170}
                height={256}
                loading="lazy"
              />
              <img
                className="dpc-abroad__img-2"
                src="/assets/img/debit-abroad-2.png"
                alt=""
                width={240}
                height={174}
                loading="lazy"
              />
              <img
                className="dpc-abroad__img-3"
                src="/assets/img/debit-abroad-3.png"
                alt=""
                width={240}
                height={174}
                loading="lazy"
              />
              <img
                className="dpc-abroad__img-4"
                src="/assets/img/debit-abroad-4.png"
                alt=""
                width={256}
                height={170}
                loading="lazy"
              />
              <img
                className="dpc-abroad__img-5"
                src="/assets/img/debit-abroad-5.png"
                alt=""
                width={190}
                height={256}
                loading="lazy"
              />
              <img
                className="dpc-abroad__img-card"
                src="/assets/img/debit-card-render.png"
                alt=""
                width={216}
                height={328}
                loading="lazy"
              />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
