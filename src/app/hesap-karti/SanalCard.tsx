"use client";

import React from "react";
import AnimatedHighlight from "@/components/AnimatedHighlight";
import Reveal, { RevealItem } from "@/components/Reveal";
import { DEBIT_SANAL } from "@/data/content";
import { useHandoffPhase } from "./CardHandoff";
import { useTilt } from "./Tilt";

/* Sanal kart section (GFDES-2174 §5) — static layout per Figma 21830:9026:
   centered stack (heading → CTA → card → glass feature row), ring field and
   glow behind the card, -20° tilt on the stack (CSS).

   The card is also the SOURCE of the sanal→abroad handoff (CardHandoff.tsx):
   when the traveler detaches, the in-flow stack hides (visibility, not
   opacity — it must keep its box so nothing reflows) and the fixed traveler
   takes over from its exact rect. `data-handoff-source` is the measurement
   hook. Below 921px / reduced motion the traveler never mounts and this
   section is plain static. */

export default function SanalCard() {
  const phase = useHandoffPhase();
  const { wrapRef: tiltWrapRef, cardRef: tiltCardRef, onPointerMove, onPointerLeave } = useTilt();

  return (
    <section className="dpc-sanal" id={DEBIT_SANAL.id}>
      <div className="dpc-sanal__rings hide-on-mobile" aria-hidden="true" />
      <div className="dpc-container dpc-sanal__inner">
        <Reveal className="dpc-sanal__head" stagger={0.08}>
          <RevealItem>
            <h2 className="dpc-title">
              {DEBIT_SANAL.title}{" "}
              <AnimatedHighlight type="hl">{DEBIT_SANAL.titleHl}</AnimatedHighlight>
            </h2>
          </RevealItem>
          <RevealItem>
            <a href="#" className="dpc-cta dpc-sanal__cta">
              {DEBIT_SANAL.cta}
            </a>
          </RevealItem>
        </Reveal>
        <Reveal direction="none" delay={0.15}>
          <div className="dpc-sanal__media" aria-hidden="true">
            <div
              ref={tiltWrapRef}
              className="dpc-sanal__stack t-tilt"
              data-handoff-source=""
              style={phase === "idle" ? undefined : { visibility: "hidden" }}
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
            >
              {/* tilt lives one level in from data-handoff-source, so the
                  hover effect never perturbs the rect CardHandoff measures */}
              <div ref={tiltCardRef} className="t-tilt-card">
                <img src={DEBIT_SANAL.media} alt="" width={648} height={984} loading="lazy" />
                <div className="t-tilt-glare" aria-hidden="true" />
              </div>
            </div>
          </div>
        </Reveal>
        {/* Same faiz-points device as the abroad list (CMO round 2026-08-05) —
            the two horizontal benefit lists were near-identical lookalikes, so
            they now share `.dpc-points` and differ only in skin.
            Icons landed 2026-08-10 (owner feedback: "the texts look not
            balanced, let's add an icon for each item") — a repeated DS globe
            placeholder, exactly as the comp does it. Markup is identical to the
            abroad list in page.tsx: the slot renders only when `icon` is set, so
            the real glyph set drops in from content.ts with no change here. */}
        <Reveal
          as="ul"
          className="dpc-points dpc-sanal__row"
          stagger={0.08}
          style={{ "--dpc-points-n": DEBIT_SANAL.features.length } as React.CSSProperties}
        >
          {DEBIT_SANAL.features.map((f) => (
            <RevealItem as="li" className="dpc-point" key={f.text}>
              {f.icon && (
                <span className="dpc-point__ic" aria-hidden="true">
                  <img src={`/assets/icons/${f.icon}`} alt="" width={32} height={32} />
                </span>
              )}
              <p>{f.text}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
