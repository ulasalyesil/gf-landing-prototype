/* Created by Claude · INTERNAL */
"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import clsx from "clsx";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import SectionHead from "@/components/SectionHead";
import Reveal, { useMotionOff } from "@/components/Reveal";
import { DEBIT_DELIVERY } from "@/data/content";

/* "hızlı kart teslimatı" — the scroll-scrubbed delivery section (card pages
   v2, Figma 22630:16440). Replaces DeliverySteps.tsx; its ENGINE is ported
   as-is, the picture on top of it is new.

   ENGINE (from DeliverySteps, 2026-07 → 08, unchanged in kind):
   - PIN: `position: sticky` on `.dpc-dl__pin` inside a tall `.dpc-dl__track`
     (not scroll-lock: native, reversible, can never trap the user). Track
     height = sticky offset + measured pin height + SCRUB_PX, so the sticky
     travel is exactly SCRUB_PX at any viewport height, and progress runs
     over ["start start", "<SCRUB_PX>px start"] — the same travel.
   - PROGRESS: useScroll → overdamped useSpring. The spring is the fast-flick
     throttle: a trackpad flick animates THROUGH each step instead of
     teleporting past it.
   - MODES (useStepsMode): ≥921 "scrub" · 768–920 "timed" (no pin, one in-view
     run of the same driver) · ≤767 or reduced motion "off" (click accordion).
     Re-evaluated on resize; SSR renders "off".

   PICTURE (new): one driver `p` moves two things together —
   - the step list on the right: p < ⅓ → 01, < ⅔ → 02, else 03; the active row
     expands (title, copy, CTA). Rows are an accordion in every mode; in scrub
     mode a click scrolls to that step instead of fighting the scroll.
   - the tracking card on the left: `r` (0–3, one unit per road segment)
     fills the road, lights the stage dots/labels, names the status, and
     rides the courier along the road as an x-transform only.
   In "off" mode `r` follows the open step instead, so the card still tells
   the story at phone widths. The comp's frozen state (step 01, courier just
   past "yolda") is r = 1.28.

   MOTION PASS (2026-09-25) — add-ons that only READ `r`, the engine is as
   it was:
   - the courier has weight: it leans into the road with r's velocity
     (sprung, ±12°) and its wheels bob with distance travelled, settling
     upright when the road stops;
   - a route draws across the phone's map in step with the road, a dot
     riding its head toward a pulsing destination pin (the path is traced
     over delivery-map.png's streets — Zeytinoğlu Cd. into Nisbetiye Cd. —
     inside the part of the map the card doesn't cover);
   - the status rolls like a departure board; "teslim edildi" lands with a
     ring off the last node. */

const SCRUB_PX = 1400;
/* driver p → road r. Holds at each stage so the list and the card change on
   the same beat: 01 ends at ⅓ (yolda), 02 at ⅔ (kapıda), 03 delivers. */
const P_KEYS = [0, 0.28, 0.38, 0.62, 0.72, 0.95, 1];
const R_KEYS = [0.3, 1.28, 1.28, 2, 2, 3, 3];
const R_FOR_STEP = [1.28, 2, 3];
const TIMED_S = 6;

export type Mode = "scrub" | "timed" | "off";

export function useStepsMode(): Mode {
  const reduced = useReducedMotion();
  // null until mount: SSR/first paint renders the settled "off" layout,
  // avoiding a hydration mismatch; the section is below the fold.
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

const A = "/assets/img/hesap-karti";
/* in delivery-map.png's own px (640²); visible window ≈ x 0–340, y 89–329 */
const ROUTE = "M226 100 C230 160 237 225 240 280 C241 304 250 314 266 312 C280 310 292 300 300 290";
const PIN = { x: 300, y: 290 };

export default function Delivery() {
  const D = DEBIT_DELIVERY;
  const uid = useId();
  const mode = useStepsMode();
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLSpanElement>(null);

  /* Pin boundaries: re-measured on resize/reflow, so the pin can never
     strand mid-sequence. */
  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    const measure = () => track.style.setProperty("--dpc-pin-h", `${pin.offsetHeight}px`);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(pin);
    return () => ro.disconnect();
  }, [mode]);

  // scrub driver
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", `${SCRUB_PX}px start`] });
  const scrubP = useSpring(scrollYProgress, { stiffness: 150, damping: 20, mass: 1 });

  // timed driver (768–920): one run when the stage comes into view
  const timedP = useMotionValue(0);
  const inView = useInView(trackRef, { once: true, margin: "0px 0px -20% 0px" });
  const [manual, setManual] = useState<number | null>(null);
  useEffect(() => {
    if (mode !== "timed" || !inView || manual !== null) return;
    const c = animate(timedP, 1, { duration: TIMED_S, ease: "linear" });
    return () => c.stop();
  }, [mode, inView, manual, timedP]);

  const p = mode === "timed" ? timedP : scrubP;
  const driven = mode !== "off" && manual === null;

  // active step from the driver (scrub/timed) or the user (off / after a click)
  const [drivenStep, setDrivenStep] = useState(0);
  useMotionValueEvent(p, "change", (v) => setDrivenStep(v < 1 / 3 ? 0 : v < 2 / 3 ? 1 : 2));
  const [openStep, setOpenStep] = useState(0);
  const active = mode === "scrub" ? drivenStep : driven ? drivenStep : (manual ?? openStep);

  /* Road position. ONE stable motion value: it mirrors the driver while the
     driver owns the section, and springs to the open step's stage when a click
     (or "off" mode) does. A single source keeps every subscriber — fills,
     dots, status, courier — on the same number. */
  const rDriven = useTransform(p, P_KEYS, R_KEYS);
  const r = useMotionValue(R_FOR_STEP[0]);
  useMotionValueEvent(rDriven, "change", (v) => {
    if (driven) r.set(v);
  });
  useEffect(() => {
    if (driven) {
      r.set(rDriven.get());
      return;
    }
    const target = R_FOR_STEP[active];
    if (reduced) {
      r.set(target);
      return;
    }
    const c = animate(r, target, { type: "spring", duration: 0.9, bounce: 0 });
    return () => c.stop();
  }, [active, driven, reduced, r, rDriven]);

  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  const fill0 = useTransform(r, (v) => clamp01(v));
  const fill1 = useTransform(r, (v) => clamp01(v - 1));
  const fill2 = useTransform(r, (v) => clamp01(v - 2));
  const fill = [fill0, fill1, fill2];
  const [stage, setStage] = useState(1);
  useMotionValueEvent(r, "change", (v) => setStage(v >= 2.98 ? 3 : Math.floor(v)));

  // courier: road width measured once + on resize, composed as a pure x-transform
  const travel = useMotionValue(0);
  useEffect(() => {
    const el = roadRef.current;
    if (!el) return;
    const measure = () => travel.set(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [travel]);
  /* dot centres sit half a dot in from each end; the courier centre runs
     between them (a comp-px dot is 18.66 of a 336 road) */
  const motionOff = useMotionOff();
  const onScreen = useInView(trackRef, { margin: "100px 0px" });
  const rVel = useVelocity(r);
  const lean = useSpring(
    useTransform(rVel, (v) => (reduced ? 0 : Math.max(-12, Math.min(12, v * 5)))),
    { stiffness: 260, damping: 26 }
  );
  const courierX = useTransform(() => {
    const w = travel.get();
    const dot = (w * 18.66) / 336;
    const v = r.get();
    const speed = reduced ? 0 : Math.min(1, Math.abs(rVel.get()) / 1.5);
    const bob = Math.sin(v * 42) * 1.4 * speed;
    return `translateX(${(dot / 2 + (v / 3) * (w - dot)).toFixed(1)}px) translateX(-50%) translateY(${bob.toFixed(2)}px) rotate(${lean.get().toFixed(2)}deg)`;
  });

  // map route: drawn to r/3, a dot at its head
  const routeP = useTransform(r, (v) => clamp01(v / 3));
  const routeRef = useRef<SVGPathElement>(null);
  const headX = useMotionValue(PIN.x);
  const headY = useMotionValue(PIN.y);
  const placeHead = (v: number) => {
    const path = routeRef.current;
    if (!path) return;
    const pt = path.getPointAtLength(path.getTotalLength() * clamp01(v / 3));
    headX.set(pt.x);
    headY.set(pt.y);
  };
  useMotionValueEvent(r, "change", placeHead);
  useEffect(() => placeHead(r.get()));

  const onStep = (i: number) => {
    if (mode === "scrub") {
      const track = trackRef.current;
      if (!track) return;
      const top = track.getBoundingClientRect().top + window.scrollY;
      const target = [0.2, 0.5, 0.84][i];
      window.scrollTo({ top: top + target * SCRUB_PX, behavior: reduced ? "auto" : "smooth" });
      return;
    }
    if (mode === "timed") setManual(i);
    else setOpenStep(i);
  };

  const t = D.tracking;

  return (
    <section className="dpc-dl" data-mode={mode} aria-labelledby={`${uid}-h`}>
      <div className="dpc-container">
        <SectionHead
          eyebrow={<span className="dpc-dl__eyebrow-text">{D.eyebrow}</span>}
          eyebrowClassName="dpc-dl__eyebrow"
          title={D.title}
          sub={D.sub}
          titleId={`${uid}-h`}
          className="dpc-dl__head"
        />
      </div>

      <div
        className="dpc-dl__track"
        ref={trackRef}
        style={{ "--dpc-scrub": `${SCRUB_PX}px` } as CSSProperties}
      >
        <div className="dpc-dl__pin" ref={pinRef}>
          <Reveal className="dpc-container dpc-dl__stage">
            {/* ——— left: phone on a dark map, tracking card over it ——— */}
            <div className="dpc-dl__visual" aria-hidden="true">
              <div className="dpc-dl__art">
                <div className="dpc-dl__phone">
                  <span className="dpc-dl__glass" />
                  <span className="dpc-dl__map">
                    <img loading="lazy" src={`${A}/delivery-map.png`} alt="" width={640} height={640} />
                    <svg className="dpc-dl__route" viewBox="0 0 640 640" width="640" height="640" fill="none">
                      <path className="dpc-dl__route-bed" d={ROUTE} />
                      <motion.path ref={routeRef} className="dpc-dl__route-line" d={ROUTE} style={{ pathLength: routeP }} />
                      {!motionOff && onScreen && (
                        <motion.circle
                          className="dpc-dl__route-pin-pulse"
                          cx={PIN.x}
                          cy={PIN.y}
                          r="9"
                          initial={{ scale: 1, opacity: 0.5 }}
                          animate={{ scale: 2.8, opacity: 0 }}
                          transition={{ duration: 2.2, ease: "easeOut", repeat: Infinity }}
                        />
                      )}
                      <circle className="dpc-dl__route-pin" cx={PIN.x} cy={PIN.y} r="6" />
                      <motion.circle className="dpc-dl__route-head" cx={headX} cy={headY} r="7" />
                    </svg>
                  </span>
                  <img loading="lazy" className="dpc-dl__island" src={`${A}/delivery-island.svg`} alt="" width={76.9575} height={26.8456} />
                  <span className="dpc-dl__frame" />
                </div>

                <div className="dpc-dl__card">
                  <div className="dpc-dl__card-top">
                    <span className="dpc-dl__status">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={stage}
                          className="dpc-dl__status-in"
                          initial={{ y: "80%", opacity: 0 }}
                          animate={{ y: "0%", opacity: 1 }}
                          exit={{ y: "-80%", opacity: 0 }}
                          transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                        >
                          {t.stages[Math.min(3, Math.max(0, stage))]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className="dpc-dl__eta">
                      <img loading="lazy" src={`${A}/icon-clock.svg`} alt="" width={18.66} height={18.66} />
                      {t.eta}
                    </span>
                  </div>
                  <p className="dpc-dl__addr">
                    <b>{t.addressLabel}</b> {t.address}
                  </p>
                  <div className="dpc-dl__stepper">
                    <span className="dpc-dl__road" ref={roadRef}>
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i} className="dpc-dl__node">
                          <span className="dpc-dl__dot">
                            {/* re-keyed on completion, so a node pops as the road reaches it */}
                            <motion.img loading="lazy"
                              key={stage >= i ? "done" : "todo"}
                              src={`${A}/${stage >= i ? "stepper-done" : "stepper-todo"}.svg`}
                              alt=""
                              width={18.6589}
                              height={18.6589}
                              initial={{ scale: 0.55 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", duration: 0.45, bounce: 0.45 }}
                            />
                            {i === 3 && stage === 3 && (
                              <motion.span
                                className="dpc-dl__burst"
                                initial={{ scale: 0.6, opacity: 0.7 }}
                                animate={{ scale: 2.6, opacity: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                            )}
                          </span>
                          {i < 3 && (
                            <span className="dpc-dl__seg">
                              <motion.span className="dpc-dl__seg-fill" style={{ scaleX: fill[i] }} />
                            </span>
                          )}
                        </span>
                      ))}
                      <motion.img loading="lazy"
                        className="dpc-dl__courier"
                        src={`${A}/courier.svg`}
                        alt=""
                        width={37.318}
                        height={32.653}
                        style={{ transform: courierX }}
                      />
                    </span>
                    <span className="dpc-dl__labels">
                      {t.stages.map((s, i) => (
                        <span key={s} className={clsx("dpc-dl__label", stage >= i && "is-done")}>
                          {s}
                        </span>
                      ))}
                    </span>
                  </div>
                  <span className="dpc-dl__rule" />
                  <span className="dpc-dl__faq">
                    <span>{t.faq}</span>
                    <img loading="lazy" src={`${A}/icon-chevron-down.svg`} alt="" width={28} height={28} />
                  </span>
                </div>
              </div>
            </div>

            {/* ——— right: the three steps ——— */}
            <ol className="dpc-dl__steps">
              {D.steps.map((s, i) => {
                const on = i === active;
                const num = String(i + 1).padStart(2, "0");
                return (
                  <motion.li
                    key={i}
                    layout="position"
                    transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                    className={clsx("dpc-dl__step", on && "is-active")}
                  >
                    <h3 className="dpc-dl__step-head">
                      <button
                        type="button"
                        aria-expanded={on}
                        aria-controls={`${uid}-s${i}`}
                        onClick={() => onStep(i)}
                      >
                        <img loading="lazy" src={`${A}/delivery-bullet.svg`} alt="" width={4} height={4} />
                        {/* spaces for the accessible name ("01 ücretsiz…"); flex drops them */}
                        <span className="dpc-dl__num">{num}</span>{" "}
                        <span className="dpc-dl__label-sm">{s.title}</span>
                      </button>
                    </h3>
                    <div className="dpc-dl__panel" id={`${uid}-s${i}`} hidden={!on}>
                      <motion.div
                        key={on ? "on" : "off"}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", duration: 0.45, bounce: 0 }}
                        className="dpc-dl__panel-in"
                      >
                        <p className="dpc-dl__title" aria-hidden="true">
                          {s.title}
                        </p>
                        {s.desc && <p className="dpc-dl__desc">{s.desc}</p>}
                        <a className="dpc-dl__cta" href={D.href}>
                          {D.cta}
                        </a>
                      </motion.div>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
