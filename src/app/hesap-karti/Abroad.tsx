/* Created by Claude · INTERNAL */
"use client";

import { useId } from "react";
import SectionHead from "@/components/SectionHead";
import Reveal, { RevealItem } from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import TiltCard from "@/components/TiltCard";
import { useStory } from "@/components/useStory";
import type { LoopDef } from "@/components/useStory";
import { DEBIT_ABROAD } from "@/data/content";

/* "hesap kartınla yurtdışında yapılacaklar listesi" — Web comp 302:40451
   (2026-10-14). Two wide tiles (the %1 nakit iade trail, the EUR/USD → TL
   wallet), then a 500-tall photo row: two cities either side of the card.

   The tile art is the comp's own vectors, laid out as drawn. Each tile acts
   out its line (useStory: once in view, again on a hover over the tile;
   ≤767 / reduced motion = the comp, still):
   - nakit iade — the orbit swings in, the plane rows trail in toward the
     TL note and on out the far side, the note lands; then the orbit turns
     slowly and the note floats. (No % glyph in the art: % means faiz.)
   - kur — EUR and USD slide in, the dashes draw, a coin rolls off each
     flag into the wallet (it gives on each), and the TR badge stamps on:
     paid in TL.
   The card keeps its pointer tilt, the photos their scroll drift. */

const A = "/assets/img/hesap-karti";
const EASE = [0.16, 1, 0.3, 1] as const;
const POP = { type: "spring", duration: 0.6, bounce: 0.45 } as const;
/* flag centre → wallet centre: 32 (half flag) + 44 + 32 (dash) + 44 + 37 */
const ROLL = 189;

/* the orbit turns once a minute behind both tiles, after the story */
const ORBIT_LOOP: LoopDef = [".dbc-ab-art__orbit", { rotate: [0, 360] }, { duration: 60, ease: "linear", repeat: Infinity }];

function CashbackTile({ t }: { t: Copy }) {
  // planes trail in toward the note, the note lands, planes trail on out
  const scope = useStory<HTMLElement>(
    [
      [".dbc-ab-art__orbit", { rotate: [-120, 0], scale: [0.8, 1], opacity: [0, 1] }, { duration: 1.2, ease: EASE }],
      [".dbc-ab-art__planes--l", { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] }, { duration: 0.7, ease: "easeOut", at: 0.1 }],
      [".dbc-ab-art__tl", { y: [36, 0], rotate: [-14, 0], scale: [0.55, 1], opacity: [0, 1] }, { ...POP, at: 0.55 }],
      // flipped row: its local right edge is the one by the note
      [".dbc-ab-art__planes--r", { clipPath: ["inset(0 0 0 100%)", "inset(0 0 0 0%)"] }, { duration: 0.7, ease: "easeOut", at: 0.75 }],
    ],
    { amount: 0.6, hoverTarget: "self", loops: [ORBIT_LOOP, [".dbc-ab-art__tl", { y: [0, -5, 0] }, { duration: 4, ease: "easeInOut", repeat: Infinity }]] }
  );
  return (
    <Tile t={t} k="cb" scope={scope}>
      <div className="dbc-ab-art dbc-ab-art--cb">
        <img className="dbc-ab-art__orbit" src={`${A}/abroad-orbit.svg`} alt="" width={203} height={203} loading="lazy" />
        <img className="dbc-ab-art__planes dbc-ab-art__planes--l" src={`${A}/abroad-planes-l.svg`} alt="" width={281.395} height={26.8526} loading="lazy" />
        <span className="dbc-ab-art__tl">
          <img src={`${A}/abroad-tl-card.svg`} alt="" width={232.331} height={319.646} loading="lazy" />
        </span>
        <img className="dbc-ab-art__planes dbc-ab-art__planes--r" src={`${A}/abroad-planes-r.svg`} alt="" width={281.395} height={26.8526} loading="lazy" />
      </div>
    </Tile>
  );
}

function FxTile({ t }: { t: Copy }) {
  // EUR and USD each send a coin down the dash into the wallet; it pays in TL
  const scope = useStory<HTMLElement>(
    [
      [".dbc-ab-art__orbit", { rotate: [-120, 0], scale: [0.8, 1], opacity: [0, 1] }, { duration: 1.2, ease: EASE }],
      [".dbc-ab-art__cur--eur", { x: [-28, 0], opacity: [0, 1] }, { duration: 0.6, ease: EASE, at: 0.1 }],
      [".dbc-ab-art__cur--usd", { x: [28, 0], opacity: [0, 1] }, { duration: 0.6, ease: EASE, at: 0.18 }],
      [".dbc-ab-art__dash--l", { scaleX: [0, 1] }, { duration: 0.35, ease: "easeOut", at: 0.45 }],
      [".dbc-ab-art__dash--r", { scaleX: [0, 1] }, { duration: 0.35, ease: "easeOut", at: 0.5 }],
      [".dbc-ab-art__ghost--eur", { x: [0, ROLL], rotate: [0, 360], scale: [1, 0.35], opacity: [0, 1, 1, 0] }, { duration: 0.75, ease: "easeIn", opacity: { times: [0, 0.1, 0.8, 1], duration: 0.75 }, at: 0.7 }],
      [".dbc-wl", { scale: [1, 1.12, 1] }, { duration: 0.35, at: 1.42 }],
      [".dbc-ab-art__ghost--usd", { x: [0, -ROLL], rotate: [0, -360], scale: [1, 0.35], opacity: [0, 1, 1, 0] }, { duration: 0.75, ease: "easeIn", opacity: { times: [0, 0.1, 0.8, 1], duration: 0.75 }, at: 1.0 }],
      [".dbc-wl", { scale: [1, 1.12, 1] }, { duration: 0.35, at: 1.72 }],
      [".dbc-wl__flag, .dbc-wl__ring", { scale: [0, 1] }, { ...POP, at: 1.85 }],
    ],
    { amount: 0.6, hoverTarget: "self", loops: [ORBIT_LOOP] }
  );
  return (
    <Tile t={t} k="fx" scope={scope}>
      <div className="dbc-ab-art dbc-ab-art--fx">
        <img className="dbc-ab-art__orbit dbc-ab-art__orbit--fx" src={`${A}/abroad-orbit.svg`} alt="" width={203} height={203} loading="lazy" />
        <span className="dbc-ab-art__cur dbc-ab-art__cur--eur">
          <span className="dbc-ab-art__tag">EUR</span>
          <span className="dbc-ab-art__coin">
            <img src={`${A}/flag-eu.svg`} alt="" width={64} height={64} loading="lazy" />
            <img className="dbc-ab-art__ghost dbc-ab-art__ghost--eur" src={`${A}/flag-eu.svg`} alt="" width={64} height={64} loading="lazy" />
          </span>
        </span>
        <img className="dbc-ab-art__dash dbc-ab-art__dash--l" src={`${A}/abroad-dash.svg`} alt="" width={32} height={3} loading="lazy" />
        {/* the TL wallet, from its layers (305:41034) */}
        <span className="dbc-wl">
          <img className="dbc-wl__flap" src={`${A}/abroad-wallet-flap.svg`} alt="" width={39.8571} height={32.149} loading="lazy" />
          <span className="dbc-wl__body" />
          <span className="dbc-wl__card" />
          <span className="dbc-wl__sheen" />
          <img className="dbc-wl__ring" src={`${A}/abroad-wallet-ring.svg`} alt="" width={61.7143} height={61.7143} loading="lazy" />
          <span className="dbc-wl__flag">
            <img src={`${A}/flag-tr.png`} alt="" loading="lazy" />
          </span>
          <span className="dbc-wl__tab" />
        </span>
        <img className="dbc-ab-art__dash dbc-ab-art__dash--r" src={`${A}/abroad-dash.svg`} alt="" width={32} height={3} loading="lazy" />
        <span className="dbc-ab-art__cur dbc-ab-art__cur--usd">
          <span className="dbc-ab-art__coin">
            <img src={`${A}/flag-us.svg`} alt="" width={64} height={64} loading="lazy" />
            <img className="dbc-ab-art__ghost dbc-ab-art__ghost--usd" src={`${A}/flag-us.svg`} alt="" width={64} height={64} loading="lazy" />
          </span>
          <span className="dbc-ab-art__tag">USD</span>
        </span>
      </div>
    </Tile>
  );
}

type Copy = (typeof DEBIT_ABROAD)["cashback"];

function Tile({ t, k, scope, children }: { t: Copy; k: string; scope: React.Ref<HTMLElement>; children: React.ReactNode }) {
  return (
    <RevealItem as="article" ref={scope} className={`dbc-abroad__tile dbc-abroad__tile--${k}`}>
      <h3 className="dbc-abroad__tile-title">
        {t.pre}
        <b>{t.em}</b>
        {t.post}
      </h3>
      <div className="dbc-abroad__tile-art" aria-hidden="true">
        {children}
      </div>
    </RevealItem>
  );
}

function Photo({ name, y }: { name: string; y: number }) {
  return (
    <RevealItem className="dpc-photo dbc-abroad__photo">
      <Parallax y={y}>
        <img src={`${A}/${name}.webp`} alt="" width={1100} height={734} loading="lazy" />
      </Parallax>
    </RevealItem>
  );
}

export default function Abroad() {
  const X = DEBIT_ABROAD;
  const uid = useId();
  const [l1, l2, r1, r2] = X.photos;
  return (
    <section className="dbc-abroad" aria-labelledby={`${uid}-h`}>
      <div className="dpc-container">
        <SectionHead
          title={
            <>
              {X.title[0]}{" "}
              <br />
              {X.title[1]}
            </>
          }
          sub={X.sub}
          titleId={`${uid}-h`}
          className="dbc-abroad__head"
        />
        <Reveal className="dbc-abroad__tiles" stagger={0.08}>
          <CashbackTile t={X.cashback} />
          <FxTile t={X.fx} />
        </Reveal>
        <Reveal className="dbc-abroad__row" stagger={0.08}>
          <div className="dbc-abroad__col">
            <Photo name={l1} y={6} />
            <Photo name={l2} y={6} />
          </div>
          {/* the card you hold: tilts to the pointer, swings up on entry */}
          <RevealItem className="dbc-abroad__cell">
            <TiltCard className="dbc-abroad__card">
              <img src={`${A}/abroad-card.webp`} alt="" width={920} height={1407} loading="lazy" />
            </TiltCard>
          </RevealItem>
          <div className="dbc-abroad__col">
            <Photo name={r1} y={-6} />
            <Photo name={r2} y={-6} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
