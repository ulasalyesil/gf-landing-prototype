"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedHighlight from "@/components/AnimatedHighlight";
import Reveal, { RevealItem } from "@/components/Reveal";
import CreditHero from "./Hero";
import { CREDIT_AVANTAJ, CREDIT_TAKSIT, CREDIT_SSS } from "@/data/content";
import "@/styles/product-page.css";
import "./credit.css";

/* GFDES-2243 — /kredi-karti, first draft (2026-08-19).

   Spine: hero → avantajlar → taksit → sss. Deliberately shorter than
   /hesap-karti: that page earns its length with real proof sections (pinned
   delivery scrub, sanal kart, abroad collage) built from shipped assets. There
   is no equivalent asset set for this card yet, so padding the page with
   half-filled sections would make it look finished when it is not.

   `.dpc` on <body> is what the shared chrome hangs off (footer background,
   hamburger colour) — same as /hesap-karti. */

export default function CreditPage() {
  useEffect(() => {
    document.body.classList.add("dpc");
    return () => {
      document.body.classList.remove("dpc");
    };
  }, []);

  return (
    <>
      <Header variant="inner" />
      <main className="dpc ckp">
        {/* ============ 1. HERO ============ */}
        <CreditHero />

        {/* ============ 2. AVANTAJLAR ============
            Same grid as /hesap-karti's earn v2 — lead row full width, two
            tinted tiles beneath. The lead tile is the one thing that differs:
            an ekstre row instead of a copy block. See credit.css. */}
        <section className="ckp-avantaj">
          <div className="dpc-container">
            <Reveal as="header" className="ckp-avantaj__head">
              <h2 className="dpc-title">
                {CREDIT_AVANTAJ.title}{" "}
                <AnimatedHighlight type="hl">{CREDIT_AVANTAJ.titleHl}</AnimatedHighlight>
              </h2>
              <p className="ckp-avantaj__sub">{CREDIT_AVANTAJ.sub}</p>
            </Reveal>

            <Reveal className="ckp-avantaj__grid" stagger={0.08}>
              {/* — the signature — */}
              <RevealItem as="article" className="ckp-ekstre">
                <span className="ckp-ekstre__label">{CREDIT_AVANTAJ.aidat.label}</span>
                {/* Statement row: label left, leader, amount right. The leader is
                    a border on a flex spacer, not dot characters — screen readers
                    never read it, and it can't wrap or drift out of alignment. */}
                <p className="ckp-ekstre__row">
                  <span className="ckp-ekstre__rowlabel">{CREDIT_AVANTAJ.aidat.row}</span>
                  <span className="ckp-ekstre__leader" aria-hidden="true" />
                  <span className="ckp-ekstre__amount">{CREDIT_AVANTAJ.aidat.amount}</span>
                </p>
                <p className="ckp-ekstre__note">{CREDIT_AVANTAJ.aidat.note}</p>
              </RevealItem>

              <RevealItem as="article" className="ckp-tile ckp-tile--taksit">
                <p className="ckp-tile__copy">
                  {CREDIT_AVANTAJ.taksit.pre}
                  <span className="ckp-tile__em">{CREDIT_AVANTAJ.taksit.em}</span>
                  {CREDIT_AVANTAJ.taksit.post}
                </p>
              </RevealItem>

              <RevealItem as="article" className="ckp-tile ckp-tile--getirpara">
                <p className="ckp-tile__copy">
                  {CREDIT_AVANTAJ.getirpara.pre}
                  <span className="ckp-tile__em">{CREDIT_AVANTAJ.getirpara.em}</span>
                  {CREDIT_AVANTAJ.getirpara.post}
                </p>
                <p className="ckp-tile__note">{CREDIT_AVANTAJ.getirpara.note}</p>
              </RevealItem>
            </Reveal>
          </div>
        </section>

        {/* ============ 3. TAKSİT ============ */}
        <section className="ckp-taksit">
          <div className="dpc-container">
            <Reveal className="ckp-taksit__inner">
              <RevealItem>
                <h2 className="dpc-title">
                  {CREDIT_TAKSIT.title}{" "}
                  <AnimatedHighlight type="hl">{CREDIT_TAKSIT.titleHl}</AnimatedHighlight>
                </h2>
              </RevealItem>
              <RevealItem>
                <p className="ckp-taksit__sub">{CREDIT_TAKSIT.sub}</p>
              </RevealItem>
              <RevealItem>
                {/* Live page renders the bare URL as its own link text. Labelled
                    here, and marked as leaving the site. */}
                <a
                  className="ckp-taksit__link"
                  href={CREDIT_TAKSIT.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CREDIT_TAKSIT.link.label}
                  <span className="ckp-taksit__ext" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </RevealItem>
            </Reveal>
          </div>
        </section>

        {/* ============ 4. SSS ============
            The objection block neither card page has today. Native <details> so
            it works without JS and is keyboard-operable for free. */}
        <section className="ckp-sss">
          <div className="dpc-container">
            <Reveal as="header" className="ckp-sss__head">
              <h2 className="dpc-title">
                {CREDIT_SSS.title}{" "}
                <AnimatedHighlight type="hl">{CREDIT_SSS.titleHl}</AnimatedHighlight>
              </h2>
            </Reveal>
            <Reveal className="ckp-sss__list" stagger={0.06}>
              {CREDIT_SSS.items.map((item) => (
                <RevealItem key={item.q}>
                  <details className="ckp-sss__item">
                    <summary className="ckp-sss__q">
                      {item.q}
                      <span className="ckp-sss__sign" aria-hidden="true" />
                    </summary>
                    <p className="ckp-sss__a">{item.a}</p>
                  </details>
                </RevealItem>
              ))}
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
