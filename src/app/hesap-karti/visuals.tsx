/* Created by Claude · INTERNAL */
"use client";

import { stagger, useMotionValue, useTransform, motion } from "motion/react";
import type { AnimationSequence } from "motion/react";
import { useStory } from "@/components/useStory";
import { DEBIT_BENEFITS } from "@/data/content";
import CashbackArt from "./CashbackArt";

/* Bento tile illustrations for /hesap-karti (card pages v2): the benefit
   bento (Figma 22630:18396) and the abroad bento (22630:19413). Rebuilt from
   the comp's layers — phone outlines, skeleton screens, the wallet widget,
   the iOS notification — so each piece can animate. Geometry is comp px
   through `--u` (see `.dpc-tile__visual`); all of it is decorative.

   Motion pass (2026-09-25): each tile acts out its benefit once in view and
   again on hover (useStory); the rest frame is the comp.
   - getirpara: the getir pills light up → a coin drops from getirmarket into
     the wallet → the meter fills and the amounts count up to the comp's.
   - abonelik: the Dynamic Island swells and the nakit iade notification
     drops out of it, the way iOS does it; the subscriptions pop in beneath.
   - cashback: a plane flies the dotted trail through the ₺ card; the %1
     coins pop onto the orbit and then ride it round.
   - fx: EUR and USD each roll a coin down the dots into the TL wallet,
     whose flap lifts to take them. */

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

/** Phone with a nakit iade notification, over the subscription marks. */
export function AbonelikVisual() {
  const n = DEBIT_BENEFITS.abonelik.notification;
  /* the island pill, clipped to the island's own width at either end */
  const ISL = "inset(0% 30.76% round 99px)";
  const WIDE = "inset(0% 0% round 99px)";
  const scope = useStory([
    [".dpc-ab__isl", { opacity: [0, 1, 1, 0], clipPath: [ISL, WIDE, WIDE, ISL] }, { duration: 1.2, times: [0, 0.22, 0.72, 1], ease: "easeInOut" }],
    [".dpc-ab__note", { y: ["-88%", "0%"], scaleX: [0.2, 1], scaleY: [0.3, 1], opacity: [0, 1] }, { type: "spring", duration: 0.7, bounce: 0.22, at: "-0.95" }],
    [".dpc-ab__note > *", { opacity: [0, 1] }, { duration: 0.25, delay: stagger(0.05), at: "-0.45" }],
    [".dpc-ab__mark", { scale: [0.4, 1], opacity: [0, 1] }, { ...POP, delay: stagger(0.12), at: "-0.1" }],
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

      <div className="dpc-ab__marks">
        <span className="dpc-ab__mark dpc-ab__mark--amazon">
          <img loading="lazy" src={`${A}/logo-amazon.png`} alt="" width={160} height={160} />
        </span>
        <img loading="lazy" className="dpc-ab__dots" src={`${A}/connector-dots-2.svg`} alt="" width={13.6468} height={1.5479} />
        <span className="dpc-ab__mark dpc-ab__mark--spotify">
          <img loading="lazy" src={`${A}/logo-spotify.png`} alt="" width={160} height={160} />
        </span>
      </div>
    </div>
  );
}

/* the plane chase: inbound far → near, a beat on the card, outbound near → far */
const PLANES: [string, number][] = [
  [".cb-l1", 0.1], [".cb-l2", 0.1], [".cb-l3", 0.2], [".cb-l4", 0.5],
  [".cb-r4", 0.5], [".cb-r3", 0.2], [".cb-r2", 0.1], [".cb-r1", 0.1],
];
const ORBIT_S = 40;

/** Plane trail around the ₺ card, with two %1 coins riding the dotted orbit. */
export function CashbackVisual() {
  const seq: AnimationSequence = [
    ...PLANES.map(([sel, base], i): AnimationSequence[number] => [
      sel, { opacity: [base, 1, base] }, { duration: 0.5, ease: "easeInOut", at: i * 0.09 + (i > 3 ? 0.18 : 0) },
    ]),
    [".cb-card", { scale: [1, 1.06, 1] }, { duration: 0.45, ease: EASE, at: 0.34 }],
    [".dpc-cb__coin", { scale: [0.3, 1], opacity: [0, 1] }, { ...POP, delay: stagger(0.16), at: 0.42 }],
  ];
  const scope = useStory(seq, {
    loops: [
      [".dpc-cb__orbit", { rotate: [0, 360] }, { duration: ORBIT_S, ease: "linear", repeat: Infinity }],
      [".dpc-cb__coin", { rotate: [0, -360] }, { duration: ORBIT_S, ease: "linear", repeat: Infinity }],
      [".cb-orbit", { rotate: [0, 360] }, { duration: ORBIT_S, ease: "linear", repeat: Infinity }],
      ...PLANES.map(([sel, base], i): [string, Record<string, unknown[]>, Record<string, unknown>] => [
        sel, { opacity: [base, 1, base] }, { duration: 0.5, ease: "easeInOut", delay: 3 + i * 0.09 + (i > 3 ? 0.18 : 0), repeat: Infinity, repeatDelay: 4 },
      ]),
    ],
  });
  return (
    <div className="dpc-cb" ref={scope}>
      <CashbackArt className="dpc-cb__art" />
      {/* the coins sit on the art's dotted orbit; turning this layer rides them round it */}
      <span className="dpc-cb__orbit">
        <span className="dpc-cb__coin dpc-cb__coin--a">%1</span>
        <span className="dpc-cb__coin dpc-cb__coin--b">%1</span>
      </span>
    </div>
  );
}

/** EUR → wallet (TL) ← USD. */
export function FxVisual() {
  const scope = useStory([
    [".dpc-fx__flag", { scale: [0.4, 1], opacity: [0, 1] }, { ...POP, delay: stagger(0.1) }],
    [".dpc-fx__tag", { y: [8, 0], opacity: [0, 1] }, { duration: 0.4, ease: EASE, delay: stagger(0.1), at: "-0.3" }],
    [".dpc-fx__dots", DRAW, { duration: 0.25, ease: "linear", at: "-0.25" }],
    [".dpc-wallet__flap", { rotate: [0, -26, 0] }, { duration: 1, times: [0, 0.35, 1], ease: "easeInOut" }],
    [".dpc-fx__coin--eur", { x: ["-830%", "0%"], scale: [0.8, 1, 0.3], opacity: [0, 1, 0] }, { duration: 0.65, ease: "easeInOut", at: "<" }],
    [".dpc-fx__coin--usd", { x: ["830%", "0%"], scale: [0.8, 1, 0.3], opacity: [0, 1, 0] }, { duration: 0.65, ease: "easeInOut", at: "-0.55" }],
    [".dpc-wallet", { scale: [1, 1.08, 1] }, { duration: 0.4, ease: EASE, at: "-0.05" }],
    [".dpc-wallet__ring", { scale: [1, 1.3, 1] }, { duration: 0.45, ease: EASE, at: "<" }],
  ]);
  return (
    <div className="dpc-fx" ref={scope}>
      <i className="dpc-fx__coin dpc-fx__coin--eur" />
      <i className="dpc-fx__coin dpc-fx__coin--usd" />
      <div className="dpc-fx__row">
        <img loading="lazy" className="dpc-fx__flag" src={`${A}/flag-eu.svg`} alt="" width={32} height={32} />
        <img loading="lazy" className="dpc-fx__dots" src={`${A}/connector-dots.svg`} alt="" width={15.4378} height={1.75104} />
        <span className="dpc-wallet">
          <img loading="lazy" className="dpc-wallet__flap" src={`${A}/wallet-flap.svg`} alt="" width={26.5714} height={21.4327} />
          <i className="dpc-wallet__body" />
          <i className="dpc-wallet__face" />
          <i className="dpc-wallet__shine" />
          <span className="dpc-wallet__flag">
            <img loading="lazy" className="dpc-wallet__ring" src={`${A}/wallet-flag-ring.svg`} alt="" width={41.1429} height={41.1429} />
            <span className="dpc-wallet__tr">
              <img loading="lazy" src={`${A}/flag-tr.png`} alt="" width={128} height={85} />
            </span>
          </span>
          <i className="dpc-wallet__tab" />
        </span>
        <img loading="lazy" className="dpc-fx__dots" src={`${A}/connector-dots.svg`} alt="" width={15.4378} height={1.75104} />
        <img loading="lazy" className="dpc-fx__flag" src={`${A}/flag-us.svg`} alt="" width={32} height={32} />
      </div>
      <span className="dpc-fx__tag dpc-fx__tag--eur">EUR</span>
      <span className="dpc-fx__tag dpc-fx__tag--usd">USD</span>
    </div>
  );
}
