"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHighlight from "./AnimatedHighlight";
import Button from "./Button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Loan() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const snapRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (
      !sectionRef.current ||
      !mediaRef.current ||
      !snapRef.current ||
      !copyRef.current
    )
      return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      // Bypass animations on mobile
      gsap.set(copyRef.current, { opacity: 1, x: 0 });
      copyRef.current.classList.add("is-in");
      return;
    }

    let ins = { t: 0, r: 0, b: 0, l: 0 };

    const measure = () => {
      if (
        !mediaRef.current ||
        !sectionRef.current ||
        !snapRef.current
      )
        return;
      const m = mediaRef.current.getBoundingClientRect();
      const s = sectionRef.current.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const eh = Math.max(m.left, vw - m.right);
      const ev = Math.max(m.top - s.top, s.bottom - m.bottom);

      gsap.set(snapRef.current, {
        left: -eh,
        top: -ev,
        width: m.width + 2 * eh,
        height: m.height + 2 * ev,
      });

      ins = { t: ev, r: eh, b: ev, l: eh };
    };

    const apply = (p: number) => {
      if (!snapRef.current || !copyRef.current) return;
      snapRef.current.style.clipPath = `inset(${ins.t * p}px ${
        ins.r * p
      }px ${ins.b * p}px ${ins.l * p}px round ${24 * p}px)`;

      const cp = Math.min(1, Math.max(0, (p - 0.55) / 0.45));
      copyRef.current.style.opacity = String(cp);
      copyRef.current.style.transform = `translateX(${-40 * (1 - cp)}px)`;
      copyRef.current.classList.toggle("is-in", cp > 0.5);
    };

    measure();
    apply(0);

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "center center",
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        measure();
        apply(self.progress);
      },
      onUpdate: (self) => apply(self.progress),
    });
  }, { scope: sectionRef });

  return (
    <section className="section loan" id="kredi" ref={sectionRef}>
      <div className="container loan__inner">
        <div className="loan__copy" ref={copyRef}>
          <p className="loan__kicker">₺650.000’ye kadar kredi</p>
          <h2 className="loan__title">
            getirfinans’ta kredin büyük
            <br />
            <AnimatedHighlight type="mark">
              iyi oranlarla geri ödemesi rahat
            </AnimatedHighlight>
          </h2>
          <p className="loan__desc">
            limitini, faiz oranını ve başvuru sonucunu saniyeler içinde öğren.
            36 aya kadar esnek vade seçenekleriyle avantajlı faiz oranlarından
            yararlan
          </p>
          <Button href="#calc">hesapla</Button>
        </div>

        <div className="loan__media" ref={mediaRef} data-label="kredi-outdoor.png">
          <div className="loan__snap" ref={snapRef}>
            <img src="/assets/img/kredi-outdoor.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
