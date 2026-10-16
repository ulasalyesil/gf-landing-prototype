/* Created by Claude · INTERNAL */
"use client";

import { Fragment } from "react";
import { stagger, useMotionValue, useTransform, motion } from "motion/react";
import { useStory } from "@/components/useStory";
import { DEBIT_BENEFITS } from "@/data/content";

/* Bento tile illustrations for /hesap-karti (card pages v2): the benefit
   bento (Figma 22630:18396; Web comp 283:22714). The abroad tiles' art moved
   to Abroad.tsx with the 2026-10-14 comp. Rebuilt from
   the comp's layers — phone outlines, skeleton screens, the wallet widget,
   the iOS notification — so each piece can animate. Geometry is comp px
   through `--u` (see `.dpc-tile__visual`); all of it is decorative.

   Motion pass (2026-09-25): each tile acts out its benefit once in view and
   again on hover (useStory); the rest frame is the comp.
   - getirpara: the getir pills light up → a coin drops from getirmarket into
     the wallet → the meter fills and the amounts count up to the comp's.
   - abonelik: the Dynamic Island swells and the nakit iade notification
     drops out of it, the way iOS does it; the subscription pills pop in beneath. */

const EASE = [0.16, 1, 0.3, 1] as const;
const POP = { type: "spring", duration: 0.5, bounce: 0.4 } as const;
const DRAW = { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] };
/* 1234567 → "1.234.567" (tr grouping; no Intl so SSR and client agree) */
const group = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const A = "/assets/img/hesap-karti";

/* Skeleton app screen: two cards over a list row (tile 1) or an icon row (tile 2). */
function SkeletonCard({ tall }: { tall?: boolean }) {
  return (
    <span className={tall ? "dpc-skel__card dpc-skel__card--tall" : "dpc-skel__card"}>
      <i className="dpc-skel__bar" />
      <span className="dpc-skel__pair">
        <i className="dpc-skel__bar dpc-skel__bar--s" />
        <i className="dpc-skel__bar" />
      </span>
      <i className="dpc-skel__bar dpc-skel__bar--s" />
      {tall && (
        <span className="dpc-skel__pair">
          <i className="dpc-skel__bar dpc-skel__bar--s" />
          <i className="dpc-skel__bar" />
        </span>
      )}
    </span>
  );
}

/** getirmarket / getirbitaksi pills over a phone holding the getirpara wallet. */
export function GetirparaVisual() {
  const w = DEBIT_BENEFITS.getirpara.wallet;
  /* the counters rest on the comp's numbers (SSR, motion off) */
  const amountTo = Number(w.amount.int.replace(/\./g, ""));
  const totalTo = Number(w.total.replace(/[^\d,]/g, "").split(",")[0]);
  const totalDec = w.total.slice(w.total.lastIndexOf(","));
  const amount = useMotionValue(amountTo);
  const total = useMotionValue(totalTo);
  const amountText = useTransform(amount, group);
  const totalText = useTransform(total, (v) => `₺${group(v)}${totalDec}`);
  const scope = useStory([
    [".dpc-gp__pill", { y: [-12, 0], opacity: [0, 1] }, { ...POP, delay: stagger(0.12) }],
    [".dpc-gp__dots", DRAW, { duration: 0.25, ease: "linear", at: "-0.4" }],
    // the coin arcs from the getirmarket pill into the wallet
    [
      ".dpc-gp__coin",
      { x: ["-340%", "0%"], y: ["-450%", "0%"], scale: [0.7, 1, 0.4], opacity: [0, 1, 0] },
      { x: { duration: 0.7, ease: "easeOut" }, y: { duration: 0.7, ease: "easeIn" }, scale: { duration: 0.7 }, opacity: { duration: 0.7, times: [0, 0.2, 1] }, at: "-0.1" },
    ],
    [".dpc-gp__w-fill", { scaleX: [0, 1] }, { duration: 0.9, ease: EASE, at: "-0.12" }],
    [amount, [0, amountTo], { duration: 0.9, ease: EASE, at: "<" }],
    [total, [totalTo - amountTo, totalTo], { duration: 0.9, ease: EASE, at: "<" }],
  ]);
  return (
    <div className="dpc-gp" ref={scope}>
      <div className="dpc-gp__phone">
        <div className="dpc-gp__screen">
          <div className="dpc-skel">
            <span className="dpc-skel__row">
              <SkeletonCard tall />
              <SkeletonCard tall />
            </span>
            <span className="dpc-skel__item">
              <i className="dpc-skel__sq" />
              <span className="dpc-skel__pair dpc-skel__pair--fill">
                <i className="dpc-skel__bar" />
                <i className="dpc-skel__bar dpc-skel__bar--xs" />
              </span>
            </span>
          </div>
        </div>
        <span className="dpc-gp__frame" />
        <span className="dpc-gp__home" />
      </div>

      <div className="dpc-gp__wallet">
        <span className="dpc-gp__w-head">
          <span className="dpc-gp__w-label">{w.label}</span>
          <span className="dpc-gp__w-brand">{w.brand}</span>
          <span className="dpc-gp__w-amount">
            <small>{w.amount.cur}</small>
            <motion.span>{amountText}</motion.span>
            <small>{w.amount.dec}</small>
          </span>
        </span>
        <span className="dpc-gp__w-meter">
          <span className="dpc-gp__w-track" />
          <span className="dpc-gp__w-fill" style={{ width: `${w.progress * 100}%` }} />
          <span className="dpc-gp__w-cap">
            <b>
              <small>{w.cap.cur}</small>
              {w.cap.int}
              <small>{w.cap.dec}</small>
            </b>{" "}
            <small>{w.cap.unit}</small>
          </span>
        </span>
        <span className="dpc-gp__w-total">
          <span>{w.totalLabel}</span>
          <motion.b>{totalText}</motion.b>
        </span>
        <i className="dpc-gp__coin" />
      </div>

      <div className="dpc-gp__pills">
        <span className="dpc-gp__pill">
          <span className="dpc-gp__pill-in">
            <img loading="lazy" src={`${A}/wordmark-getirmarket.svg`} alt="" width={95.8264} height={16} />
          </span>
        </span>
        <img loading="lazy" className="dpc-gp__dots" src={`${A}/connector-dots.svg`} alt="" width={15.4378} height={1.75104} />
        <span className="dpc-gp__pill">
          <img loading="lazy" src={`${A}/pill-getirbitaksi.svg`} alt="" width={138.489} height={44.4444} />
        </span>
      </div>
    </div>
  );
}

/** Phone with a nakit iade notification, over the subscription pills. */
export function AbonelikVisual() {
  const { notification: n, services } = DEBIT_BENEFITS.abonelik;
  /* the island pill, clipped to the island's own width at either end */
  const ISL = "inset(0% 30.76% round 99px)";
  const WIDE = "inset(0% 0% round 99px)";
  const scope = useStory([
    [".dpc-ab__isl", { opacity: [0, 1, 1, 0], clipPath: [ISL, WIDE, WIDE, ISL] }, { duration: 1.2, times: [0, 0.22, 0.72, 1], ease: "easeInOut" }],
    [".dpc-ab__note", { y: ["-88%", "0%"], scaleX: [0.2, 1], scaleY: [0.3, 1], opacity: [0, 1] }, { type: "spring", duration: 0.7, bounce: 0.22, at: "-0.95" }],
    [".dpc-ab__note > *", { opacity: [0, 1] }, { duration: 0.25, delay: stagger(0.05), at: "-0.45" }],
    [".dpc-ab__pills .dpc-gp__pill", { y: [12, 0], opacity: [0, 1] }, { ...POP, delay: stagger(0.12), at: "-0.1" }],
    [".dpc-ab__dots", DRAW, { duration: 0.25, ease: "linear", at: "-0.35" }],
  ]);
  return (
    <div className="dpc-ab" ref={scope}>
      <div className="dpc-ab__screen">
        <span className="dpc-skel__row">
          <SkeletonCard />
          <SkeletonCard />
        </span>
        <span className="dpc-ab__apps">
          <img loading="lazy" src={`${A}/skeleton-app-a.svg`} alt="" width={42.6121} height={63.208} />
          <img loading="lazy" src={`${A}/skeleton-app-a.svg`} alt="" width={42.6121} height={63.208} />
          <img loading="lazy" src={`${A}/skeleton-app-b.svg`} alt="" width={42.6121} height={63.208} />
          <img loading="lazy" src={`${A}/skeleton-app-a.svg`} alt="" width={42.6121} height={63.208} />
        </span>
      </div>
      <span className="dpc-ab__frame" />
      <img loading="lazy" className="dpc-ab__island" src={`${A}/phone-island.svg`} alt="" width={76.9575} height={26.8456} />
      <i className="dpc-ab__isl" />

      <div className="dpc-ab__note">
        <span className="dpc-appicon">
          <span className="dpc-appicon__angle">
            <i />
          </span>
          <img loading="lazy" className="dpc-appicon__getir" src={`${A}/appicon-getir.svg`} alt="" width={19.8447} height={8.95117} />
          <span className="dpc-appicon__finans">
            <img loading="lazy" src={`${A}/appicon-finans.svg`} alt="" width={166.651} height={176.668} />
          </span>
        </span>
        <span className="dpc-ab__note-text">
          <b>{n.app}</b>
          <span>{n.body}</span>
        </span>
        <span className="dpc-ab__note-time">{n.time}</span>
      </div>

      {/* same pill as the getirpara tile, with the service named in text */}
      <div className="dpc-ab__pills">
        {services.map((name, i) => (
          <Fragment key={name}>
            {i > 0 && <img loading="lazy" className="dpc-gp__dots dpc-ab__dots" src={`${A}/connector-dots.svg`} alt="" width={15.4378} height={1.75104} />}
            <span className="dpc-gp__pill">
              <span className="dpc-gp__pill-in dpc-ab__pill-in">{name}</span>
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
