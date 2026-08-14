"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { AnimationItem } from "lottie-web";
import clsx from "clsx";
import AnimatedHighlight from "@/components/AnimatedHighlight";
import Reveal from "@/components/Reveal";
import { DEBIT_STEPS, DEBIT_STEPS_SECTION } from "@/data/content";

/* "Hızlı kart teslimatı" scroll sequence (GFDES-2174 §2)

   PIN MECHANISM — position: sticky (not scroll-lock). The section is a tall
   scroll track; `.dpc-steps__pin` sticks for its length. Chosen because it is
   native (no scroll-event interception), scroll-up reversal comes for free
   (progress simply runs backwards), and it can never trap the user.

   PIN BOUNDARIES — the track is `pinHeight + SCRUB_PX` tall, so the sticky
   travel is exactly SCRUB_PX regardless of viewport height. The pin's height
   is measured (ResizeObserver) into `--dpc-pin-h`, so a resize — or content
   reflow — resizes the track and the boundaries move with it. Progress is
   read over ["start start", "<SCRUB_PX>px start"], which is the same travel:
   progress reaches 1 exactly as the pin releases. (Deriving the track from
   100vh instead lets the pin drift out early whenever its content is taller
   than the viewport.)

   PROGRESS MODEL — useScroll on the track → useSpring smoothing. The spring
   makes fast flicks animate THROUGH each state instead of teleporting past
   it, and threshold events fire on every crossing, so completion states
   always render (fast-scroll edge case). Segment map (track progress):

     bar 1  0.00–0.24   → check lottie fires at 75% of the bar (0.18)
     bar 2  0.32–0.58   → courier rides the bar, hold until 0.66
     bar 3  0.66–0.90   → getirpara + cashback icons pop + bounce at 75%
                          of the bar (0.84); 0.90–1.00 hold, then unpin
   Step copy is driver-bound too: each item fades/rises in over an APPEAR
   window that completes exactly as its bar segment begins (step 1 right at
   pin-in, steps 2/3 during the preceding hold), so the points build with
   the scroll and retract on reverse. Settled mode renders them static.
   Holds are sized for ≤1s lottie files — retune SEG when the real files
   arrive so completions land in sync with scroll pacing.

   COMPLETION MARKS — inline with each step title (owner decision 2026-07-13):
   step 1 plays the supplied check lottie (green circle pop) when its bar
   fills; step 3 bounces the getirpara + cashback icons — no lottie, no badge.
   Scroll-up policy: lottie RESETS to first frame (goToAndStop 0) below the
   threshold (hysteresis 0.03) — the sequence never skips to unpinned on
   reverse.

   MODES (explicit touch decision — no silent broken scroll-jack):
     ≥921px             "scrub"  scroll-linked pinned sequence
     768–920px          "timed"  no pin; one 4s in-view run of the same
                                 driver, eased with the landing courier curve
                                 cubic-bezier(.16,1,.3,1)
     ≤767px / reduced   "off"    settled end state (bars full, icons shown,
                                 courier hidden — mirrors landing mobile)
   Mode re-evaluates on resize (matchMedia listeners); within scrub, sticky +
   useScroll recalculate boundaries natively, so a mid-pin resize cannot
   strand the section (resize edge case).

   COURIER — ported from the landing (.debit__moto in DebitCard.tsx /
   sections.css): same translateX(calc(-50% + travel)) composition, same
   ResizeObserver travel measurement, same `moto-bob` keyframes on the
   separate `translate` property. Travel is x-transform only (compositor)
   per fixing-motion-performance — no CSS-var/left animation. */

const STEP1_LOTTIE: string | null = "/assets/lottie/check.json";

/* Phone mock: frame PNG with a transparent screen hole (Dynamic Island baked
   into the frame overlay); app screens stack behind it and each one slides in
   from the right as its step begins. Screen i maps to step i:
   kart seç → kurye takip → harcarken kazandıkların. */
const MOCK_SCREENS = [
  "/assets/img/steps/screen-1.png",
  "/assets/img/steps/screen-2.png",
  "/assets/img/steps/screen-3.png",
];

/* SEG / APPEAR / TIMED_* / SCRUB_PX and useStepsMode are exported for the
   compact layout variant (DeliveryCompact.tsx, ?steps=compact) so both
   layouts share one timing model and one mode policy. */
const SEG_DONE1 = 0.24;
const SEG_BAR2_IN = 0.32;
const SEG_BAR2_OUT = 0.58;
const SEG_BAR3_IN = 0.66;
const SEG_DONE3 = 0.9;

export const SEG = {
  bar1: [0, SEG_DONE1] as [number, number],
  done1: SEG_DONE1,
  bar2: [SEG_BAR2_IN, SEG_BAR2_OUT] as [number, number],
  bar3: [SEG_BAR3_IN, SEG_DONE3] as [number, number],
  done3: SEG_DONE3,
};
/* completion marks fire at 75% of their bar — the check/coins land while the
   fill is still moving, so the payoff isn't gated on pixel-perfect bar-end */
const MARK1 = SEG_DONE1 * 0.75;
const MARK3 = SEG_BAR3_IN + (SEG_DONE3 - SEG_BAR3_IN) * 0.75;
const HYST = 0.03;
/* width of each step-copy fade window on the driver */
export const APPEAR = 0.06;
export const TIMED_DURATION = 5;
/* Landing .debit__moto travel curve (sections.css: transform 2.4s
   cubic-bezier(.16,1,.3,1)). It governs the courier's TRAVEL leg only —
   driving the whole 3-step timeline with it collapses the sequence
   (all three bars finish inside ~1.2s), so the other legs run linear. */
const COURIER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
/* Driver keyframes for the timed fallback: fill 1 → hold → courier rides →
   hold → fill 3 → hold. Segment boundaries mirror SEG exactly. */
export const TIMED_KEYS = [0, SEG_DONE1, SEG_BAR2_IN, SEG_BAR2_OUT, SEG_BAR3_IN, SEG_DONE3, 1];
export const TIMED_TIMES = [0, 0.16, 0.22, 0.55, 0.62, 0.9, 1];
export const TIMED_EASE = ["linear", "linear", COURIER_EASE, "linear", "linear", "linear"] as const;
/* Sticky travel. Single source of truth: fed to CSS as --dpc-scrub and to
   useScroll as the progress end edge, so the two can never disagree. */
export const SCRUB_PX = 1600;

export type Mode = "scrub" | "timed" | "off";

export function useStepsMode(): Mode {
  const reduced = useReducedMotion();
  // null until mount: SSR/first paint renders the settled "off" layout,
  // avoiding a hydration mismatch; the section is below the fold so the
  // swap to scrub/timed happens before it is reached.
  const [wide, setWide] = useState<boolean | null>(null);
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mqWide = window.matchMedia("(min-width: 921px)");
    const mqSmall = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setWide(mqWide.matches);
      setSmall(mqSmall.matches);
    };
    update();
    mqWide.addEventListener("change", update);
    mqSmall.addEventListener("change", update);
    return () => {
      mqWide.removeEventListener("change", update);
      mqSmall.removeEventListener("change", update);
    };
  }, []);
  if (reduced || small || wide === null) return "off";
  return wide ? "scrub" : "timed";
}

/* Step completion mark: plays the supplied lottie once available; until
   then a static icon pops in (icon-pop recipe). Reset = first frame. */
function StepBadge({
  lottieSrc,
  fallbackIcon,
  done,
}: {
  lottieSrc: string | null;
  fallbackIcon: string;
  done: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!lottieSrc || !boxRef.current) return;
    let cancelled = false;
    let anim: AnimationItem | null = null;
    import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !boxRef.current) return;
      anim = lottie.loadAnimation({
        container: boxRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: lottieSrc,
      });
      // 1.4×: the check lands in sync with its bar instead of trailing it
      anim.setSpeed(1.4);
      animRef.current = anim;
    });
    return () => {
      cancelled = true;
      anim?.destroy();
      animRef.current = null;
    };
  }, [lottieSrc]);

  useEffect(() => {
    const anim = animRef.current;
    if (!anim) return;
    if (done) anim.play();
    else anim.goToAndStop(0, true);
  }, [done]);

  if (lottieSrc) {
    return <div ref={boxRef} className="dpc-steps__badge" aria-hidden="true" />;
  }
  return (
    <motion.span
      className="dpc-steps__badge"
      aria-hidden="true"
      initial={false}
      animate={
        done
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, scale: 0.25, filter: "blur(4px)" }
      }
      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
    >
      <img src={fallbackIcon} alt="" />
    </motion.span>
  );
}

export default function DeliverySteps() {
  const mode = useStepsMode();
  const trackRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const barTrackRef = useRef<HTMLDivElement>(null);

  /* Pin boundaries: track height = pin height + SCRUB_PX. Re-measured on
     resize/reflow, so the pin can never strand mid-animation. */
  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    const measure = () => track.style.setProperty("--dpc-pin-h", `${pin.offsetHeight}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pin);
    return () => observer.disconnect();
  }, [mode]);

  // scrub driver: scroll progress across exactly the sticky travel
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", `${SCRUB_PX}px start`],
  });
  /* Overdamped on purpose: this IS the fast-flick throttle. A stiff spring
     lets a trackpad flick teleport progress 0→1 in ~100ms, firing both
     completion lotties at once. ~1s settle makes a flick animate through
     each step so every completion state is seen. Verified by probe. */
  const scrubProgress = useSpring(scrollYProgress, { stiffness: 150, damping: 20, mass: 1 });

  // timed driver (768–920): one eased run when the section enters view
  const timedProgress = useMotionValue(0);
  const inView = useInView(trackRef, { once: true, margin: "0px 0px -20% 0px" });
  useEffect(() => {
    if (mode !== "timed" || !inView) return;
    const controls = animate(timedProgress, TIMED_KEYS, {
      duration: TIMED_DURATION,
      times: [...TIMED_TIMES],
      ease: [...TIMED_EASE],
    });
    return () => controls.stop();
  }, [mode, inView, timedProgress]);

  const driver = mode === "timed" ? timedProgress : scrubProgress;

  const bar1 = useTransform(driver, SEG.bar1, [0, 1]);
  const bar2 = useTransform(driver, SEG.bar2, [0, 1]);
  const bar3 = useTransform(driver, SEG.bar3, [0, 1]);
  const bars = [bar1, bar2, bar3];

  /* step copy: fade+rise windows. These used to END where each bar segment
     starts, which placed them INSIDE the phone's screen-swap window
     (item2 0.26–0.32 against a 0.23–0.32 slide; item3 0.60–0.66 against
     0.57–0.66) — left and right moving together, the exact thing the CMO
     round flagged. They now START at the segment boundary, so the swap
     finishes before the copy moves and only one column is ever in motion.
     Copy rising while its own bar fills is same-column and reads as a list
     revealing, not as two competing animations.
     Full transform strings (not the y shorthand) — scroll-linked motion runs
     while the main thread is busy scrolling, so it must stay composited. */
  const item1In = useTransform(driver, [0, APPEAR], [0, 1]);
  const item2In = useTransform(driver, [SEG.bar2[0], SEG.bar2[0] + APPEAR], [0, 1]);
  const item3In = useTransform(driver, [SEG.bar3[0], SEG.bar3[0] + APPEAR], [0, 1]);
  const item1T = useTransform(() => `translateY(${((1 - item1In.get()) * 16).toFixed(2)}px)`);
  const item2T = useTransform(() => `translateY(${((1 - item2In.get()) * 16).toFixed(2)}px)`);
  const item3T = useTransform(() => `translateY(${((1 - item3In.get()) * 16).toFixed(2)}px)`);
  const itemIn = [item1In, item2In, item3In];
  const itemT = [item1T, item2T, item3T];

  /* Phone screens — iOS-push grammar, driver-bound (fully reversible):
     the incoming screen slides in from the right over SCREEN_WIN while the
     outgoing one recedes -22% behind it (depth: two surfaces exchanging
     place, not a sticker landing on top). Wider than APPEAR on purpose —
     the swap is the hero moment of the pinned view. Screen 1 is part of
     the mock from the start. */
  const SCREEN_WIN = 0.09;
  const w2 = [SEG.bar2[0] - SCREEN_WIN, SEG.bar2[0]] as [number, number];
  const w3 = [SEG.bar3[0] - SCREEN_WIN, SEG.bar3[0]] as [number, number];
  const screen1T = useTransform(driver, w2, ["translateX(0%)", "translateX(-22%)"]);
  const screen2T = useTransform(
    driver,
    [w2[0], w2[1], w3[0], w3[1]],
    ["translateX(100%)", "translateX(0%)", "translateX(0%)", "translateX(-22%)"]
  );
  const screen3T = useTransform(driver, w3, ["translateX(100%)", "translateX(0%)"]);
  const screenT = [screen1T, screen2T, screen3T];

  /* Phone lift REMOVED (CMO round 2026-08-05). The phone used to be taller
     than the stage and rested bottom-cropped, so it rose ~500-600px over the
     step-2 window to reveal the screens' bottom drawers. That translate was
     the heaviest motion on the page and it ran concurrently with bar 2 + the
     courier on the left — "hem sağda hem solda aynı anda animasyon".
     The phone is now sized to fit the stage whole (see --dpc-phone-w in
     debit-current.css, derived from the stage height), so there is nothing to
     reveal and nothing to move: the right column only changes screens.
     The FRAME_* constants and the offset-chain measurement went with it. If
     the phone ever grows past the stage again, recover this from git. */
  const mockRef = useRef<HTMLDivElement>(null);

  // courier travel: measured once + on resize (DebitCard.tsx pattern) into a
  // motion value, then composed reactively as a pure x-transform
  // (full transform string = hardware-accelerated)
  const travel = useMotionValue(0);
  useEffect(() => {
    const el = barTrackRef.current;
    if (!el) return;
    const measure = () => travel.set(el.offsetWidth);
    measure();
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode, travel]);
  const courierTransform = useTransform(
    () => `translateX(calc(-50% + ${(bar2.get() * travel.get()).toFixed(1)}px))`
  );
  const courierOpacity = useTransform(driver, [SEG.bar2[0] - 0.03, SEG.bar2[0]], [0, 1]);

  // threshold states (hysteresis so scroll-up retracts cleanly)
  const [done1, setDone1] = useState(false);
  const [done3, setDone3] = useState(false);
  const [riding, setRiding] = useState(false);
  useMotionValueEvent(driver, "change", (v) => {
    setDone1((prev) => (prev ? v > MARK1 - HYST : v >= MARK1));
    setDone3((prev) => (prev ? v > MARK3 - HYST : v >= MARK3));
    setRiding(v > SEG.bar2[0] && v < SEG.bar2[1]);
  });

  const settled = mode === "off";

  return (
    <section
      className="dpc-steps"
      data-mode={mode}
      ref={trackRef}
      style={{ "--dpc-scrub": `${SCRUB_PX}px` } as React.CSSProperties}
    >
      <div className="dpc-steps__pin" ref={pinRef}>
        {/* band = the visible lilac card; the pin itself is a transparent
            100vh window that centers it (scrub mode) */}
        <div className="dpc-steps__band">
        <div className="dpc-container">
          {/* stage = the phone-driven clip window; the container pads around
              it (80px) and is the full section height — the pin wraps this. */}
          <div className="dpc-steps__stage">
          <div className="dpc-steps__top">
            <Reveal className="dpc-steps__intro">
              <h2 className="dpc-title">
                {DEBIT_STEPS_SECTION.title}{" "}
                <AnimatedHighlight type="hl">{DEBIT_STEPS_SECTION.titleHl}</AnimatedHighlight>
              </h2>
              <p className="dpc-steps__sub">{DEBIT_STEPS_SECTION.sub}</p>
              <a href="#" className="dpc-cta dpc-steps__cta">
                {DEBIT_STEPS_SECTION.cta}
              </a>
            </Reveal>
          </div>
          {/* hero mock — desktop: absolute right, 3× scale, bleeding past the
              pin bottom (pin clips it, so track height is unaffected) */}
          <Reveal direction="none" className="dpc-steps__phone">
            <motion.div className="dpc-steps__mock" aria-hidden="true" ref={mockRef}>
              <div className="dpc-steps__mock-screen">
                {MOCK_SCREENS.map((src, i) => (
                  <motion.img
                    key={src}
                    src={src}
                    alt=""
                    width={480}
                    height={1043}
                    loading="lazy"
                    initial={false}
                    style={settled ? undefined : { transform: screenT[i] }}
                  />
                ))}
              </div>
              <img
                className="dpc-steps__mock-frame"
                src="/assets/img/steps/frame.png"
                alt=""
                width={800}
                height={1355}
                loading="lazy"
              />
            </motion.div>
          </Reveal>
          {/* driver-bound, not Reveal: appearance follows the scrub, not the
              viewport. Settled mode renders static (SSR paints this). */}
          <ol className="dpc-steps__list">
            {DEBIT_STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                className="dpc-steps__item"
                initial={false}
                style={settled ? undefined : { opacity: itemIn[i], transform: itemT[i] }}
              >
                <span className="dpc-steps__num" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="dpc-steps__title-row">
                  <h3>{step.title}</h3>
                  {i === 0 && (
                    <StepBadge
                      lottieSrc={STEP1_LOTTIE}
                      fallbackIcon="/assets/icons/ek-hesap.svg"
                      done={settled || done1}
                    />
                  )}
                  {i === 2 && (
                    <span className="dpc-steps__rewards" aria-hidden="true">
                      {["/assets/icons/getirpara.svg", "/assets/icons/cashback.svg"].map(
                        (src, j) => (
                          <motion.img
                            key={src}
                            src={src}
                            alt=""
                            initial={false}
                            animate={
                              settled
                                ? { opacity: 1, scale: 1, y: 0 }
                                : done3
                                  ? { opacity: 1, scale: 1, y: [0, -10, 0] }
                                  : { opacity: 0, scale: 0.25, y: 0 }
                            }
                            transition={
                              !settled && done3
                                ? {
                                    /* celebratory payoff — the one earned moment of
                                       playful overshoot in the sequence */
                                    opacity: { type: "spring", duration: 0.3, bounce: 0 },
                                    scale: { type: "spring", duration: 0.45, bounce: 0.35 },
                                    y: {
                                      duration: 0.55,
                                      ease: "easeInOut",
                                      times: [0, 0.4, 1],
                                      delay: 0.15 + j * 0.08,
                                      repeat: 1,
                                    },
                                  }
                                : { type: "spring", duration: 0.3, bounce: 0 }
                            }
                          />
                        )
                      )}
                    </span>
                  )}
                </div>
                {/* The explicit space is load-bearing, not cosmetic: the mobile
                    swipe deck hides this <br> (debit-current.css) because the
                    desktop-tuned break fragments the copy in a 206px card, and
                    without a real space character the two halves would run
                    together as "uygulamadantek". Costs nothing on desktop —
                    trailing whitespace before a forced break collapses. */}
                <p>
                  {step.desc[0]}{" "}
                  <br />
                  {step.desc[1]}
                </p>
                <div className="dpc-steps__bar" ref={i === 1 ? barTrackRef : undefined}>
                  <motion.div
                    className="dpc-steps__bar-fill"
                    style={settled ? undefined : { scaleX: bars[i] }}
                  />
                  {i === 1 && (
                    <motion.img
                      className={clsx("dpc-steps__courier", riding && "is-riding")}
                      src="/assets/icons/courier.svg"
                      alt="kurye"
                      style={settled ? undefined : { transform: courierTransform, opacity: courierOpacity }}
                    />
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
