"use client";

import React from "react";
import Reveal, { RevealItem } from "./Reveal";
import AnimatedHighlight from "./AnimatedHighlight";
import AnimatedNumber from "./AnimatedNumber";

export default function Stats() {
  return (
    <section className="section stats" id="stats">
      <div className="container">
        <Reveal as="header" className="sec-head">
          <h2 className="sec-title">
            her gün daha fazla <AnimatedHighlight type="hl">getirfinanslı</AnimatedHighlight>
          </h2>
        </Reveal>

        <Reveal className="stats__card" stagger={0.1}>
          <RevealItem className="stat">
            <AnimatedNumber
              value={1000000}
              suffix="+"
              className="stat__num"
            />
            <span className="stat__label">getirfinanslı</span>
          </RevealItem>

          <span className="stat__div" aria-hidden="true"></span>

          <RevealItem className="stat">
            <span className="stat__num">4 getirfinanslı’dan 1’i</span>
            <span className="stat__label">referans koduyla geliyor</span>
          </RevealItem>

          <span className="stat__div" aria-hidden="true"></span>

          <RevealItem className="stat">
            <span className="stat__num">türkiye’nin ilk</span>
            <span className="stat__label">servis bankacılığı deneyimi</span>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
