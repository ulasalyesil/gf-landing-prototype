"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import lottie from "lottie-web";
import AnimatedHighlight from "./AnimatedHighlight";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AiAssistant() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<HTMLDivElement>(null);
  const [lottieLoaded, setLottieLoaded] = useState(false);

  useEffect(() => {
    if (!lottieRef.current) return;

    // Load Lottie
    let anim: any;
    try {
      anim = lottie.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/assets/lottie/ai-assistant.json",
      });

      anim.addEventListener("DOMLoaded", () => {
        setLottieLoaded(true);
      });

      ScrollTrigger.create({
        trigger: lottieRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => anim.play(),
      });
    } catch (e) {
      console.warn("Lottie failed to load:", e);
    }

    return () => {
      if (anim) anim.destroy();
    };
  }, []);

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
  }, { scope: containerRef });

  return (
    <section className="section ai" id="ai" ref={containerRef}>
      <div className="container">
        <div className="eyebrow-wrap">
          <h2 className="h-sec reveal">
            akıllı asistana sor,{" "}
            <AnimatedHighlight type="mark">
              hesabını daha kolay yönet!
            </AnimatedHighlight>
          </h2>
          <p className="h-lead reveal">
            faizinden transferlerine kadar hesabınla ilgili sorularına saniyeler
            içinde cevap al
          </p>
        </div>

        <div className="ai__stage reveal">
          {/* Lottie container (hidden on mobile via global CSS) */}
          <div
            ref={lottieRef}
            className={`ai__lottie ${!lottieLoaded ? "ph" : ""}`}
            data-label="ai-assistant.json"
          >
            {!lottieLoaded && (
              <img
                src="/assets/img/ai-assistant-fallback.png"
                alt="AI Assistant Fallback"
              />
            )}
          </div>

          {/* Mobile static fallback image (hidden on desktop via global CSS) */}
          <div className="ai__mobile-img">
            <img src="/assets/img/ai-assistant-mobile.png" alt="AI Assistant" />
          </div>
        </div>
      </div>
    </section>
  );
}
