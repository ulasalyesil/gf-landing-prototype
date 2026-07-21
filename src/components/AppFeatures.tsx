"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import Reveal, { useMotionOff } from "./Reveal";
import AnimatedHighlight from "./AnimatedHighlight";

export default function AppFeatures() {
  const darkRef = useRef<HTMLElement>(null);
  const off = useMotionOff();

  /* "ışıkları kapattık!" — the lights actually go out: as the section scrolls
     toward viewport center the backdrop dims from lifted to full dark and the
     copy reveals only after the dim lands. Reduced motion / mobile: plain fade. */
  const { scrollYProgress } = useScroll({
    target: darkRef,
    offset: ["start end", "center center"],
  });
  const brightness = useTransform(scrollYProgress, [0, 1], [1.75, 1]);
  const mediaFilter = useMotionTemplate`brightness(${brightness})`;
  const copyOpacity = useTransform(scrollYProgress, [0.6, 0.95], [0, 1]);
  const copyY = useTransform(scrollYProgress, [0.6, 0.95], [24, 0]);

  return (
    <div>
      {/* 11. APP SPLIT (Hidden by default in prototype) */}
      <section className="section app-split" id="apps" style={{ display: "none" }}>
        <div className="container app-split__inner">
          <Reveal direction="left" className="app-split__copy">
            <h2 className="app-split__title">
              ister getir’den gir
              <br />
              <AnimatedHighlight type="mark">istersen ayrı uygulamadan</AnimatedHighlight>
            </h2>
            <ul className="app-split__list">
              <li>
                <span className="app-split__check">
                  <svg viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </span>
                koyu mod özelliği
              </li>
              <li>
                <span className="app-split__check">
                  <svg viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </span>
                uygulama ikonu üzerinden transfer işlemleri
              </li>
              <li>
                <span className="app-split__check">
                  <svg viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </span>
                yüz tanıma ve parmak izi ile giriş
              </li>
            </ul>
          </Reveal>
          <Reveal direction="right" className="app-split__media">
            <img src="/assets/img/standalone-woman.png" alt="" />
          </Reveal>
        </div>
      </section>

      {/* 11b. APP DARK MODE (Alternative - Active in prototype) */}
      <section className="section app-dark" id="apps-dark" ref={darkRef}>
        <div className="app-dark__media">
          {off ? (
            <img src="/assets/img/dark-mode-bg.png" alt="" />
          ) : (
            <motion.img
              src="/assets/img/dark-mode-bg.png"
              alt=""
              style={{ filter: mediaFilter, willChange: "filter" }}
            />
          )}
        </div>
        {off ? (
          <Reveal className="container app-dark__inner">
            <div className="app-dark__copy">
              <h2 className="app-dark__title">ışıkları kapattık!</h2>
              <p className="app-dark__lead">
                gece insanıysan getirfinans'ı
                <br />
                koyu mod'da kullanabilirsin
              </p>
            </div>
          </Reveal>
        ) : (
          <motion.div
            className="container app-dark__inner"
            style={{ opacity: copyOpacity, y: copyY }}
          >
            <div className="app-dark__copy">
              <h2 className="app-dark__title">ışıkları kapattık!</h2>
              <p className="app-dark__lead">
                gece insanıysan getirfinans'ı
                <br />
                koyu mod'da kullanabilirsin
              </p>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
