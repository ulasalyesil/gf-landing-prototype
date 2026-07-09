"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import Reveal, { RevealItem } from "@/components/Reveal";
import "./debit-hero-variants.css";

/* GFDES-2174 hero iteration — the wireframe hero plus three alternates,
   switchable live (picker bottom-center, shareable via ?hero=).
   A/wireframe: the locked comp, untouched, as the control.
   B/drenched: full-bleed card purple, rhymes with the landing hero.
   C/kart xl: stays white, the product carries the section at display scale.
   D/lilac: soft brand field, product on a white tile.
   Picker + body[data-hero] are scaffolding; they go once a direction wins. */

const VARIANTS = [
  { id: "current", label: "A · wireframe" },
  { id: "drenched", label: "B · drenched" },
  { id: "kart", label: "C · kart xl" },
  { id: "lilac", label: "D · lilac" },
] as const;

type HeroVariant = (typeof VARIANTS)[number]["id"];

function Bolt() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="w-5 h-5">
      <path d="M11 2 4.5 11h4L9 18l6.5-9h-4L11 2z" fill="currentColor" />
    </svg>
  );
}

/* Shared copy block for the alternates — identical words across variants so
   the comparison stays purely visual. Entrance: badge → title → CTA stagger. */
function HeroText() {
  return (
    <Reveal className="dpc-hero__text" stagger={0.08}>
      <RevealItem as="span" className="dpc-badge">
        <Bolt />
        kartın dakikalar içinde kapında
      </RevealItem>
      <RevealItem>
        <h1 className="dpc-hero__title">
          geri dönüşü
          <br />
          <span className="hl">muhteşem kart</span>
        </h1>
      </RevealItem>
      <RevealItem>
        <a href="#" className="dpc-cta dpc-hero__cta">
          kart al
        </a>
      </RevealItem>
    </Reveal>
  );
}

function HeroMedia({ src }: { src: string }) {
  return (
    <div className="dpc-hero__card" aria-hidden="true">
      <Reveal direction="none" delay={0.2} className="dpc-hero__media-fill">
        <video className="dpc-hero__video" autoPlay muted loop playsInline>
          <source src={src} type="video/mp4" />
        </video>
      </Reveal>
    </div>
  );
}

/* A — the locked wireframe hero, byte-for-byte the original markup */
function HeroCurrent() {
  return (
    <section className="dpc-hero">
      <div className="dpc-container h-full relative">
        <div className="dpc-hero__text">
          <span className="dpc-badge">
            <Bolt />
            kartın dakikalar içinde kapında
          </span>
          <h1 className="dpc-hero__title">
            geri dönüşü
            <br />
            muhteşem kart
          </h1>
          <a href="#" className="dpc-cta dpc-hero__cta">
            kart al
          </a>
        </div>
        <div className="dpc-hero__card" aria-hidden="true">
          <video className="dpc-hero__video" autoPlay muted loop playsInline>
            <source src="/assets/video/debit-white-bg.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}

function HeroDrenched() {
  return (
    <section className="dpc-hero dpc-hero--drenched">
      <div className="dpc-container h-full relative">
        <HeroText />
        <HeroMedia src="/assets/video/debit-card.mp4" />
      </div>
    </section>
  );
}

function HeroKart() {
  return (
    <section className="dpc-hero dpc-hero--kart">
      <div className="dpc-container h-full relative">
        <HeroText />
        <HeroMedia src="/assets/video/debit-white-bg.mp4" />
      </div>
    </section>
  );
}

function HeroLilac() {
  return (
    <section className="dpc-hero dpc-hero--lilac">
      <div className="dpc-container h-full relative">
        <HeroText />
        <HeroMedia src="/assets/video/debit-white-bg.mp4" />
      </div>
    </section>
  );
}

const isVariant = (v: string | null): v is HeroVariant =>
  !!v && VARIANTS.some((o) => o.id === v);

/* ?hero= makes a variant linkable. Read through useSyncExternalStore rather
   than a setState-in-effect: the server snapshot is null, the client snapshot
   is the real param, and React reconciles that after hydration without a
   mismatch. No subscription — the picker rewrites history itself. */
const subscribeNoop = () => () => {};
const getUrlVariant = () => new URLSearchParams(window.location.search).get("hero");
const getServerVariant = () => null;

export default function DebitHeroLab() {
  const urlVariant = useSyncExternalStore(subscribeNoop, getUrlVariant, getServerVariant);
  const [picked, setPicked] = useState<HeroVariant | null>(null);
  const variant: HeroVariant = picked ?? (isVariant(urlVariant) ? urlVariant : "current");

  // header legibility CSS keys off this (light variants get ink nav/logo)
  useEffect(() => {
    document.body.dataset.hero = variant;
    return () => {
      delete document.body.dataset.hero;
    };
  }, [variant]);

  const pick = (v: HeroVariant) => {
    setPicked(v);
    const url = new URL(window.location.href);
    url.searchParams.set("hero", v);
    window.history.replaceState(null, "", url);
  };

  return (
    <>
      {variant === "current" && <HeroCurrent />}
      {variant === "drenched" && <HeroDrenched />}
      {variant === "kart" && <HeroKart />}
      {variant === "lilac" && <HeroLilac />}

      <div className="dpc-heropick" role="group" aria-label="hero varyasyonları">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            className={clsx(variant === v.id && "is-active")}
            onClick={() => pick(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>
    </>
  );
}
