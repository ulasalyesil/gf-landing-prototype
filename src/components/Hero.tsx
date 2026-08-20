"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { HERO_OFFERS, HERO_BADGES, HERO_FLIP_MS } from "@/data/content";
import clsx from "clsx";

/* First-load sequence — the page's only load animation. Badge → title → sub
   → CTA rise in with a 90ms stagger; the overlay settles from darker to its
   final tint so the video eases in underneath the copy. */
const loadStagger: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09 } },
};

const loadItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"normal" | "exit" | "enter-start">("normal");
  const [isVideoFading, setIsVideoFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverRef = useRef(false);
  const reduced = useReducedMotion();

  /* The four offers are the video's four 5s segments, so the active slide is
     read off the video clock rather than an independent interval: an interval
     drifts a little every loop (decode jitter, background-tab throttling, a
     20s loop that isn't exactly 4×5s) and after a few minutes the copy sits on
     the wrong footage. Slot = which HERO_FLIP_MS segment currentTime is in. */
  const slotRef = useRef(0);
  const videoDrivenRef = useRef(false);

  /* Runs the exit → swap → enter phase sequence used by .t-text-swap. */
  const swapTo = React.useCallback((next: number) => {
    setPhase("exit");

    // Matches --text-swap-dur (150ms)
    setTimeout(() => {
      setIndex(next);
      setPhase("enter-start");

      // Force reflow and transition to normal state
      const reflow = document.body.offsetHeight; // triggers reflow
      void reflow;

      setTimeout(() => {
        setPhase("normal");
      }, 30);
    }, 150);
  }, []);

  /* Fallback only: keeps the copy cycling on the old fixed cadence if the
     video never plays (blocked autoplay, failed load, no timeupdate). It
     stands down as soon as the video starts driving the slides. */
  useEffect(() => {
    const timer = setInterval(() => {
      if (videoDrivenRef.current || hoverRef.current) return;
      slotRef.current = (slotRef.current + 1) % HERO_OFFERS.length;
      swapTo(slotRef.current);
    }, HERO_FLIP_MS);

    return () => clearInterval(timer);
  }, [swapTo]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    videoDrivenRef.current = true;

    // Fade out just before the loop point so the cut back to frame 0 is hidden
    setIsVideoFading(video.duration - video.currentTime < 0.6);

    const slot =
      Math.floor(video.currentTime / (HERO_FLIP_MS / 1000)) % HERO_OFFERS.length;
    if (slot === slotRef.current) return;

    /* Hover pauses the copy but not the video, so on mouse-leave we jump
       straight to whatever segment is playing instead of resuming a stale
       position — being one slide behind the footage is the thing to avoid. */
    if (hoverRef.current) return;

    slotRef.current = slot;
    swapTo(slot);
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
          <source src="/assets/video/hero-20s.mp4" type="video/mp4" />
          {/* <source src="/assets/video/hero-bg.webm" type="video/webm" /> */}
        </video>
        {reduced ? (
          <div className="hero__overlay"></div>
        ) : (
          <motion.div
            className="hero__overlay"
            initial={{ backgroundColor: "rgba(14, 14, 14, 0.55)" }}
            animate={{ backgroundColor: "rgba(14, 14, 14, 0.3)" }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        )}
      </div>

      <div className="container hero__inner">
        <motion.div
          className="hero__text"
          variants={loadStagger}
          initial={reduced ? false : "hidden"}
          animate="shown"
          onMouseEnter={() => (hoverRef.current = true)}
          onMouseLeave={() => (hoverRef.current = false)}
        >
          <motion.div variants={loadItem} className="hero__badge-stack" id="heroBadgeStack">
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
          </motion.div>

          <motion.h1 variants={loadItem} className="hero__title">
            <span
              className={clsx(
                "hero__title-swap t-text-swap",
                phase === "exit" && "is-exit",
                phase === "enter-start" && "is-enter-start"
              )}
              dangerouslySetInnerHTML={{ __html: currentOffer.title }}
            />
          </motion.h1>

          <motion.p variants={loadItem} className="hero__sub">
            <span
              className={clsx(
                "hero__sub-swap t-text-swap",
                phase === "exit" && "is-exit",
                phase === "enter-start" && "is-enter-start"
              )}
              id="heroSub"
              dangerouslySetInnerHTML={{ __html: currentOffer.sub }}
            />
          </motion.p>

          <motion.div variants={loadItem}>
            <a href="#" className="hero__cta">
              <span className="hero__cta-ic">
                <img src="/assets/icons/arrow-right-circle.svg" alt="" />
              </span>
              getirfinanslı ol
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__disclosure"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
        >
          <div className="hero__bankinfo">
            bankacılık hizmeti
            <span className="fiba">
              <img src="/assets/logos/fibabanka-logo.svg" alt="Fibabanka" />
            </span>
            tarafından verilmektedir
          </div>
          {/* Rate-claim footnote, synced to the active offer via the same swap
              phase as the title/sub; empty on slides without a rate claim.
              Fixed min-height reserves the space so the bank line never jumps. */}
          <p className="hero__legal">
            <span
              className={clsx(
                "hero__legal-swap t-text-swap",
                phase === "exit" && "is-exit",
                phase === "enter-start" && "is-enter-start"
              )}
            >
              {currentOffer.legal ?? ""}
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
