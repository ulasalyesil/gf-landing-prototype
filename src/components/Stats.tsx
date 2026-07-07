"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHighlight from "./AnimatedHighlight";
import AnimatedNumber from "./AnimatedNumber";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Port vanilla reveal animations
    gsap.utils.toArray(".reveal", containerRef.current).forEach((el: any) => {
      gsap.fromTo(
        el,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            toggleActions: "play none none none",
          },
          onComplete: () => el.classList.add("is-in"),
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section className="section stats" id="stats" ref={containerRef}>
      <div className="container">
        <header className="sec-head reveal">
          <h2 className="sec-title">
            her gün daha fazla <AnimatedHighlight type="hl">getirfinanslı</AnimatedHighlight>
          </h2>
        </header>

        <div className="stats__card reveal">
          <div className="stat">
            <AnimatedNumber
              value={1000000}
              suffix="+"
              className="stat__num"
            />
            <span className="stat__label">getirfinanslı</span>
          </div>

          <span className="stat__div" aria-hidden="true"></span>

          <div className="stat">
            <span className="stat__num">4 getirfinanslı’dan 1’i</span>
            <span className="stat__label">referans koduyla geliyor</span>
          </div>

          <span className="stat__div" aria-hidden="true"></span>

          <div className="stat">
            <span className="stat__num">türkiye’nin ilk</span>
            <span className="stat__label">servis bankacılığı deneyimi</span>
          </div>
        </div>
      </div>
    </section>
  );
}
