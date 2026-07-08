"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import lottie from "lottie-web";
import type { AnimationItem } from "lottie-web";
import Reveal from "./Reveal";
import AnimatedHighlight from "./AnimatedHighlight";

export default function AiAssistant() {
  const lottieRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [lottieLoaded, setLottieLoaded] = useState(false);
  const inView = useInView(lottieRef, { once: true, margin: "0px 0px -20% 0px" });

  useEffect(() => {
    if (!lottieRef.current) return;

    let anim: AnimationItem | undefined;
    try {
      anim = lottie.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/assets/lottie/ai-assistant.json",
      });
      animRef.current = anim;

      anim.addEventListener("DOMLoaded", () => {
        setLottieLoaded(true);
      });
    } catch (e) {
      console.warn("Lottie failed to load:", e);
    }

    return () => {
      animRef.current = null;
      if (anim) anim.destroy();
    };
  }, []);

  // Play once when scrolled into view
  useEffect(() => {
    if (inView && lottieLoaded) animRef.current?.play();
  }, [inView, lottieLoaded]);

  // Rare, user-initiated: click the stage to replay
  const handleReplay = () => {
    animRef.current?.goToAndPlay(0);
  };

  return (
    <section className="section ai" id="ai">
      <div className="container">
        <Reveal className="eyebrow-wrap">
          <h2 className="h-sec">
            akıllı asistana sor,{" "}
            <AnimatedHighlight type="mark">
              hesabını daha kolay yönet!
            </AnimatedHighlight>
          </h2>
          <p className="h-lead">
            faizinden transferlerine kadar hesabınla ilgili sorularına saniyeler
            içinde cevap al
          </p>
        </Reveal>

        <Reveal className="ai__stage">
          {/* Lottie container (hidden on mobile via global CSS) */}
          <div
            ref={lottieRef}
            className={`ai__lottie ${!lottieLoaded ? "ph" : ""}`}
            data-label="ai-assistant.json"
            onClick={handleReplay}
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
        </Reveal>
      </div>
    </section>
  );
}
