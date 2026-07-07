"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHighlight from "./AnimatedHighlight";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Faiz() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      const reveals = containerRef.current.querySelectorAll(".reveal");
      reveals.forEach((r) => r.classList.add("is-in"));
      return;
    }

    // Head and phones reveal
    gsap.fromTo(
      ".reveal",
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
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

    // Stagger points reveal
    const pointsGroup = containerRef.current.querySelector("[data-stagger]");
    if (pointsGroup) {
      gsap.fromTo(
        pointsGroup.children,
        { y: 24, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: pointsGroup,
            start: "top 82%",
          },
        }
      );
    }
  }, { scope: containerRef });

  return (
    <section className="section faiz" id="faiz" ref={containerRef}>
      <div className="container">
        <div className="eyebrow-wrap">
          <h2 className="h-sec reveal">
            yıllık %44 faizle{" "}
            <AnimatedHighlight type="mark">her gün kazan!</AnimatedHighlight>
          </h2>
          <p className="h-lead reveal">kampanyaları ve avantajları kaçırma!</p>
        </div>

        <div className="faiz__phones reveal" data-label="faiz-phones.png">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/assets/img/faiz-phones-mobile.png"
            />
            <img
              className="faiz-phones-img"
              src="/assets/img/faiz-phones.png"
              alt="faiz phones"
            />
          </picture>
        </div>

        <div className="faiz__points" data-stagger>
          <div className="fpoint">
            <span className="fpoint__ic">
              <img src="/assets/icons/faiz.svg" alt="" />
            </span>
            <p>
              paranı bağlamadan
              <br />
              iyi faiz kazan
            </p>
          </div>

          <div className="fpoint">
            <span className="fpoint__ic">
              <img src="/assets/icons/sart-yok.svg" alt="" />
            </span>
            <p>
              şart yok, kampanya yok,
              <br />
              hoş geldin yok
            </p>
          </div>

          <div className="fpoint">
            <span className="fpoint__ic">
              <img src="/assets/icons/ek-hesap.svg" alt="" />
            </span>
            <p>
              ek hesap açmana gerek yok,
              <br />
              hesabın günlük faizle kazansın
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
