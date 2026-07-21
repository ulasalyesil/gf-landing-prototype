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
            <span className="stat__num">
              her 4 getirfinanslı’dan 1’i
              <sup className="stat__ref" aria-hidden="true">*</sup>
            </span>
            <span className="stat__label">referans koduyla geliyor</span>
          </RevealItem>

          <span className="stat__div" aria-hidden="true"></span>

          <RevealItem className="stat">
            <span className="stat__num">türkiye’de ilk</span>
            <span className="stat__label">servis bankacılığı deneyimi</span>
          </RevealItem>
        </Reveal>

        <Reveal as="p" className="stats__legal" delay={0.2}>
          * 2026 yılı itibarıyla “arkadaşını getir” kampanyaları üzerinden
          referans kodu ile getirfinans müşterisi olan kişiler hesaplamaya
          dahil edilmiştir.
        </Reveal>
      </div>
    </section>
  );
}
