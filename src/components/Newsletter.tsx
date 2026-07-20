"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";
import Reveal from "./Reveal";
import AnimatedHighlight from "./AnimatedHighlight";
import { NEWSLETTER } from "@/data/content";
import type { NewsletterPage } from "@/data/content";

/* Gazete peel: the section pins and scroll peels pages off a paper stack one
   by one; the last page settles and releases the pin. ≤767px and
   prefers-reduced-motion fall back to a scroll-snap strip ("strip" mode). */

/* Sticky travel per page turn. Single source of truth: fed to CSS as
   --nl-scrub and to useScroll as the progress end edge (DeliverySteps
   --dpc-scrub pattern), so the two can never disagree. */
const TURN_PX = 800;

/* Idle fan of the pile — deterministic (no Math.random: hydration-safe). */
const FAN = [0, -0.7, 0.55, -0.45, 0.35, -0.3];

/* Each turn has two phases: peel [0, FOLD_END) grows a corner fold (the
   bottom-right corner curls over, CSS-var-driven clip-paths), then
   [FOLD_END, 1] slides the page off stage left like a turned newspaper page.
   The fold keeps creeping past FOLD_END (45% → 58%) so the roll reads as
   continuing while the page exits. */
const FOLD_END = 0.35;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/* rotateZ eased-in over the exit slide: a nudge first, committing late.
   Keyframes [0,.25,1] → [0,-1.5,-9]deg. */
const peelRot = (pl: number) =>
  pl < 0.25 ? (pl / 0.25) * -1.5 : -1.5 + ((pl - 0.25) / 0.75) * -7.5;

type Mode = "scrub" | "strip";

function useNewsletterMode(): Mode {
  const reduced = useReducedMotion();
  // null until mount: SSR/first paint renders the strip layout, avoiding a
  // hydration mismatch; the section is below the fold so the swap to scrub
  // happens before it is reached.
  const [wide, setWide] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  if (reduced || !wide) return "strip";
  return "scrub";
}

function PageCard({
  page,
  index,
  count,
  progress,
  scrub,
}: {
  page: NewsletterPage;
  index: number;
  count: number;
  progress: MotionValue<number>;
  scrub: boolean;
}) {
  const turns = Math.max(1, count - 1);
  const isLast = index === count - 1;

  // page i peels across scroll segment [i/turns, (i+1)/turns]
  const peel = useTransform(progress, [index / turns, (index + 1) / turns], [0, 1]);

  const composed = useTransform(() => {
    const pl = isLast ? 0 : peel.get();
    // exit slide only starts once the corner fold is established
    const slide = pl < FOLD_END ? 0 : (pl - FOLD_END) / (1 - FOLD_END);
    // pile depth: pages below the top sit offset and rise as pages leave
    const d = clamp(index - progress.get() * turns, 0, Math.min(index, 3));
    const rot = FAN[index % FAN.length] * Math.min(d, 1) + peelRot(slide);
    // newspaper page turn: the peeling page exits stage LEFT (x), with only a
    // slight upward drift — not up like a notepad
    const ty = slide * -7;
    const sc = (1 - d * 0.01) * (1 + slide * 0.02);
    return `translate(${(slide * -115).toFixed(2)}%, calc(${(d * 7).toFixed(1)}px + ${ty.toFixed(2)}%)) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
  });
  // corner fold distance, in % of page edge from the bottom-right corner —
  // drives the paper/fold-face clip-paths via the --nl-fold custom property
  const fold = useTransform(peel, [0, FOLD_END, 1], [0, 45, 58]);
  const foldPct = useMotionTemplate`${fold}%`;
  // lift shadow lives on its own layer: animating its opacity is
  // compositor-safe where animating box-shadow itself would repaint
  const lift = useTransform(peel, [0, 0.15, 0.6, 1], [0, 0.5, 0.5, 0]);
  // fully peeled pages fade so they don't hang above the stage
  const fade = useTransform(peel, [0.75, 1], [1, 0]);

  const active = scrub && !isLast;
  return (
    <motion.div
      className="newsletter__page"
      style={{
        zIndex: count - index,
        ...(scrub && { transform: composed, opacity: active ? fade : 1 }),
        ...(active && { "--nl-fold": foldPct }),
      }}
    >
      <motion.div
        className="newsletter__page-lift"
        aria-hidden="true"
        style={active ? { opacity: lift } : undefined}
      />
      <div className="newsletter__paper ph" data-label={`sayfa ${index + 1}`}>
        <img
          src={page.src}
          alt={page.alt}
          width={1191}
          height={1684}
          loading="lazy"
          decoding="async"
        />
      </div>
      {active && (
        <div className="newsletter__fold" aria-hidden="true">
          <div className="newsletter__fold-face" />
        </div>
      )}
    </motion.div>
  );
}

export default function Newsletter() {
  const autoMode = useNewsletterMode();
  const pages = NEWSLETTER.pages;
  // a 0/1-page gazete has nothing to peel — stay in strip mode
  const mode = pages.length < 2 ? "strip" : autoMode;
  const turns = Math.max(1, pages.length - 1);
  const scrubTotal = TURN_PX * turns;

  const trackRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  /* Pin boundaries: track height = pin height + scrub. Re-measured on
     resize/reflow, so the pin can never strand mid-animation. */
  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    const measure = () => track.style.setProperty("--nl-pin-h", `${pin.offsetHeight}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pin);
    return () => observer.disconnect();
  }, [mode]);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", `${scrubTotal}px start`],
  });
  /* Damped enough that a trackpad flick animates THROUGH each turn instead of
     teleporting the whole stack away (DeliverySteps rationale). */
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.8 });

  const [current, setCurrent] = useState(1);
  useMotionValueEvent(progress, "change", (v) => {
    if (mode !== "scrub") return;
    setCurrent(1 + clamp(Math.round(v * turns), 0, turns));
  });

  // strip mode: counter follows the snap position instead of scroll progress
  const rafRef = useRef(0);
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);
  const handleStripScroll = () => {
    if (mode !== "strip") return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = stackRef.current;
      if (!el || el.children.length < 2) return;
      const step =
        (el.children[1] as HTMLElement).offsetLeft -
        (el.children[0] as HTMLElement).offsetLeft;
      setCurrent(1 + clamp(Math.round(el.scrollLeft / Math.max(1, step)), 0, turns));
    });
  };

  return (
    <section
      className="section newsletter"
      id="newsletter"
      ref={trackRef}
      data-mode={mode}
      style={
        {
          "--nl-scrub": `${scrubTotal}px`,
          "--nl-page-ar": NEWSLETTER.pageAspect,
        } as React.CSSProperties
      }
    >
      <div className="newsletter__pin" ref={pinRef}>
        <div className="container">
          <Reveal className="eyebrow-wrap newsletter__head">
            <h2 className="h-sec">
              {NEWSLETTER.title}{" "}
              <AnimatedHighlight type="mark">{NEWSLETTER.titleHl}</AnimatedHighlight>
            </h2>
            <p className="h-lead">{NEWSLETTER.lead}</p>
          </Reveal>

          <div className="newsletter__stage">
            <div className="newsletter__stack" ref={stackRef} onScroll={handleStripScroll}>
              {pages.map((page, i) => (
                <PageCard
                  key={page.src}
                  page={page}
                  index={i}
                  count={pages.length}
                  progress={progress}
                  scrub={mode === "scrub"}
                />
              ))}
            </div>
            <p className="newsletter__counter" aria-hidden="true">
              {NEWSLETTER.issue.no} · {NEWSLETTER.issue.date} — {current} / {pages.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
