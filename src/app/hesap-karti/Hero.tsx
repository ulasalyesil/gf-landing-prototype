"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import Reveal from "@/components/Reveal";
import ProductHero from "@/components/ProductHero";
import { DEBIT_HERO } from "@/data/content";

/* GFDES-2174 hero — "kart xl" (variant C, picked from the round-1 lab):
   white field, the product carries the section at display scale, title
   matches the landing hero scale. Entrance: badge → title → CTA stagger.
   Video plays once and holds its final frame — a perpetual loop next to
   static text pulls the eye forever; one pass presents the card, done.

   The copy column moved to <ProductHero> on 2026-08-18 (shared with
   /kredi-karti). What stays here is this page's media and its geometry.

   Card geometry was dial-tunable during the 10/10 pass. The hero is locked,
   so the settled values are baked into debit-current.css (2026-08-20) and the
   DialKit hook is gone — it was pulling the whole dialkit library into this
   page's production chunk, since a hook cannot be lazily loaded and the
   NODE_ENV gate in layout only ever stopped the panel from RENDERING. */

function Bolt() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="w-5 h-5">
      <path d="M11 2 4.5 11h4L9 18l6.5-9h-4L11 2z" fill="currentColor" />
    </svg>
  );
}

export default function DebitHero({ field = false }: { field?: boolean }) {
  /* Everything else on this page already honours reduced motion — steps mode
     drops to "off", the card handoff never mounts, .t-tilt-card is killed in
     CSS, the sanal rings stop — so an autoplaying hero video was the one thing
     still moving for a user who asked for stillness. */
  const reduced = useReducedMotion();
  /* Reduced motion stops the hero video. Done here rather than by branching the
     JSX attributes, because useReducedMotion() is false on the server and true
     on a reduced-motion client — branching the markup produced a hydration
     mismatch. Seeking to the end is not a cosmetic choice: this video plays once
     and HOLDS its final frame, so the last frame is the design's resting state
     and is exactly what the poster shows. A user who asks for stillness gets the
     composition, just without the motion that builds it. */
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !reduced) return;
    const settle = () => {
      v.pause();
      if (Number.isFinite(v.duration)) v.currentTime = v.duration;
    };
    settle();
    // duration is NaN until metadata lands, so settle again once it does
    v.addEventListener("loadedmetadata", settle);
    return () => v.removeEventListener("loadedmetadata", settle);
  }, [reduced, field]);


  return (
    <ProductHero
      className={field ? "dpc-hero--field" : undefined}
      badge={DEBIT_HERO.badge}
      badgeIcon={<Bolt />}
      title={
        <>
          {DEBIT_HERO.title}
          <br />
          {DEBIT_HERO.titleHl}
        </>
      }
      sub={DEBIT_HERO.sub}
      cta={DEBIT_HERO.cta}
      ctaHref={DEBIT_HERO.href}
      legal={DEBIT_HERO.legal}
      media={
        <div className="dpc-hero__card" aria-hidden="true">
          {/* blurred lilac blob — centered behind the video, shows through
              its knocked-out white (multiply). Desktop-only via CSS. */}
          <div className="dpc-hero__blob" />
          <Reveal direction="none" delay={0.2} className="dpc-hero__media-fill">
            {/* Source follows the backdrop, because the knockout is a blend, not
                an alpha channel. The white hero multiplies `debit-white-bg` to
                erase its white; on the dark panel that same multiply would erase
                the CARD instead, so the field variant uses the dark-background
                master (`debit-card`, bg rgb(41,30,80) ≈ the panel) and no blend.
                `key` is load-bearing: <source> swaps are not picked up by a live
                <video>, so without it React reuses the element and keeps playing
                the old file. */}
            {/* Sources are ordered webm-then-mp4 because the browser takes the
                FIRST type it supports: VP9 lands ~40% smaller than the H.264 and
                everything that cannot read it falls through to the mp4.
                Both were re-encoded 2026-08-20 — the mp4 was 7.1MB at 11.2Mbps
                with a 316kb/s AAC track on a muted decorative video. Stripping
                the audio and encoding at CRF 20 gives 486KB at SSIM 0.997, and
                the white background the multiply knockout depends on measures
                identical to the original (min luma 233), so the composite is
                unchanged.
                `poster` is the FINAL frame, not the first: this video plays once
                and holds its last frame, so the poster IS the resting state, it
                paints before the video is decoded, and it is what a
                reduced-motion user is left looking at. */}
            <video
              key={field ? "dark" : "light"}
              ref={videoRef}
              className="dpc-hero__video"
              /* autoPlay/preload are deliberately NOT branched on `reduced`:
                 useReducedMotion() is false during SSR and true on a client that
                 prefers reduced motion, so branching the ATTRIBUTES here made the
                 server and client markup disagree and React logged a hydration
                 mismatch. The markup stays identical either way and the effect
                 above stops the video after hydration instead. */
              autoPlay
              muted
              playsInline
              preload="metadata"
              poster={
                field
                  ? "/assets/video/posters/debit-card.jpg"
                  : "/assets/video/posters/debit-white-bg.jpg"
              }
            >
              <source
                src={field ? "/assets/video/debit-card.webm" : "/assets/video/debit-white-bg.webm"}
                type="video/webm"
              />
              <source
                src={field ? "/assets/video/debit-card.mp4" : "/assets/video/debit-white-bg.mp4"}
                type="video/mp4"
              />
            </video>
          </Reveal>
        </div>
      }
    />
  );
}
