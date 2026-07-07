"use client";

import React, { useState, useEffect, useRef } from "react";
import { HERO_OFFERS, HERO_BADGES, HERO_FLIP_MS } from "@/data/content";
import clsx from "clsx";

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"normal" | "exit" | "enter-start">("normal");
  const [isVideoFading, setIsVideoFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cycle subtitle offers and badges
  useEffect(() => {
    const timer = setInterval(() => {
      setPhase("exit");
      
      // Matches --text-swap-dur (150ms)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % HERO_OFFERS.length);
        setPhase("enter-start");
        
        // Force reflow and transition to normal state
        const reflow = document.body.offsetHeight; // triggers reflow
        
        setTimeout(() => {
          setPhase("normal");
        }, 30);
      }, 150);
    }, HERO_FLIP_MS);

    return () => clearInterval(timer);
  }, []);

  // Handle video ending fade logic to prevent loop glitches
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      const isEnding = video.duration - video.currentTime < 0.6;
      setIsVideoFading(isEnding);
    }
  };

  const currentOffer = HERO_OFFERS[index];
  const currentBadge = HERO_BADGES[index % HERO_BADGES.length];

  return (
    <section className="hero" id="hero">
      <div className="hero__media">
        <video
          ref={videoRef}
          className={clsx("hero__video", isVideoFading && "is-fading")}
          autoPlay
          muted
          loop
          playsInline
          onTimeUpdate={handleTimeUpdate}
        >
          <source src="/assets/video/hero-bg.mp4" type="video/mp4" />
          <source src="/assets/video/hero-bg.webm" type="video/webm" />
        </video>
        <div className="hero__overlay"></div>
      </div>

      <div className="container hero__inner">
        <div className="hero__text">
          <div className="hero__badge-stack" id="heroBadgeStack">
            <div className="hero__badge is-on">
              <span className="hero__badge-ic">
                <img src="/assets/icons/people.svg" alt="" />
              </span>
              <span
                className={clsx(
                  "hero__badge-text t-text-swap",
                  phase === "exit" && "is-exit",
                  phase === "enter-start" && "is-enter-start"
                )}
                id="heroBadge"
              >
                {currentBadge}
              </span>
            </div>
          </div>
          
          <h1 className="hero__title">
            <span
              className={clsx(
                "hero__title-swap t-text-swap",
                phase === "exit" && "is-exit",
                phase === "enter-start" && "is-enter-start"
              )}
            >
              {currentOffer.title}
            </span>
          </h1>

          <p className="hero__sub">
            <span
              className={clsx(
                "hero__sub-swap t-text-swap",
                phase === "exit" && "is-exit",
                phase === "enter-start" && "is-enter-start"
              )}
              id="heroSub"
              dangerouslySetInnerHTML={{ __html: currentOffer.sub }}
            />
          </p>

          <a href="#" className="hero__cta">
            <span className="hero__cta-ic">
              <img src="/assets/icons/arrow-right-circle.svg" alt="" />
            </span>
            getirfinanslı ol
          </a>
        </div>

        <div className="hero__bankinfo">
          bankacılık hizmeti
          <span className="fiba">
            <img src="/assets/logos/fibabanka-logo.svg" alt="Fibabanka" />
          </span>
          tarafından verilmektedir
        </div>
      </div>
    </section>
  );
}
