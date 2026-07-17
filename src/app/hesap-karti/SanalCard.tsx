"use client";

import React from "react";
import AnimatedHighlight from "@/components/AnimatedHighlight";
import Reveal, { RevealItem } from "@/components/Reveal";
import { DEBIT_SANAL } from "@/data/content";
import { useHandoffPhase } from "./CardHandoff";

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
              className="dpc-sanal__stack"
              data-handoff-source=""
              style={phase === "idle" ? undefined : { visibility: "hidden" }}
            >
              <img src={DEBIT_SANAL.media} alt="" width={648} height={984} loading="lazy" />
            </div>
          </div>
        </Reveal>
        <Reveal className="dpc-sanal__row" stagger={0.08}>
          {DEBIT_SANAL.features.map((f) => (
            <RevealItem as="div" className="dpc-sanal__card" key={f}>
              <p>{f}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
