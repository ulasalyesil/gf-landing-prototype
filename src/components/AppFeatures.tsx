"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHighlight from "./AnimatedHighlight";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AppFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      const reveals = containerRef.current.querySelectorAll(".reveal");
      reveals.forEach((r) => r.classList.add("is-in"));
      return;
    }

    gsap.fromTo(
      ".reveal",
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
        onComplete: function(this: any) {
          const targets = this.targets();
          targets.forEach((t: HTMLElement) => t.classList.add("is-in"));
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* 11. APP SPLIT (Hidden by default in prototype) */}
      <section className="section app-split" id="apps" style={{ display: "none" }}>
        <div className="container app-split__inner">
          <div className="app-split__copy reveal-left">
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
          </div>
          <div className="app-split__media reveal-right">
            <img src="/assets/img/standalone-woman.png" alt="" />
          </div>
        </div>
      </section>

      {/* 11b. APP DARK MODE (Alternative - Active in prototype) */}
      <section className="section app-dark" id="apps-dark">
        <div className="app-dark__media">
          <img src="/assets/img/dark-mode-bg.png" alt="" />
        </div>
        <div className="container app-dark__inner reveal">
          <div className="app-dark__copy">
            <h2 className="app-dark__title">
              ışıkları <AnimatedHighlight type="mark">kapattık!</AnimatedHighlight>
            </h2>
            <p className="app-dark__lead">
              gece insanıysan getirfinans'ı
              <br />
              koyu mod'da kullanabilirsin
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
