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
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";
import SectionHead from "@/components/SectionHead";
import Reveal, { RevealItem, useReducedMotionSafe } from "@/components/Reveal";
import { DEBIT_DELIVERY } from "@/data/content";

/* "hızlı kart teslimatı" — Web comp 324:12076 (2026-10-14).

   LAYOUT is the comp: a stack of three cards on the left (one per step:
   the card, the courier, the earnings), the numbered steps on the right.

   SCROLL STORYBOARD (2026-10-16, proposed by Claude, owner asked for it).
   One driver `p` (0 → 1) tells the whole section; each step owns a third:
     01 kartını iste      the card pattern drifts along its diagonal; the
                          step's rule fills as you read it
     ↳ deal               the front card peels off up-left, the two behind
                          step forward into its place
     02 kurye teslim etsin  the courier drives the road (yolda → kapıda →
                          teslim edildi), segments fill, the status rolls
     ↳ deal
     03 kazanmaya başla   both wallets fill, the amounts count up
   Rest frame (SSR, ≤767, reduced motion) is the comp: step 01 open with its
   rule 60% drawn, the card 2 courier just past "yolda".

   ENGINE (ported in kind from 65e11be, which ported DeliverySteps):
   - MODES: ≥921 "scrub" — the stage pins (`position: sticky` in a tall
     track; native, reversible, never traps) and scroll drives `p` through
     an overdamped spring, so a trackpad flick animates THROUGH a step
     instead of skipping it; 768–920 "timed" — one in-view run; ≤767 or
     reduced motion "off" — clicks move `p` to that step's rest.
   - In every mode a step click moves the story there (scrub: by scrolling).
   - Everything visual reads `p` through CSS custom properties on its own
     element (handoff tripwire 9: no transform fights). */

const A = "/assets/img/hesap-karti";

/* card 1's backdrop: five diagonal runs of cards (comp column counts) */
const PATTERN = [5, 6, 4, 6, 5];

const SCRUB_PX = 2100;
const TIMED_S = 7;
/* rest of each step on the driver, and the comp's frame (01, rule at 60%) */
const STEP_REST = [0.2, 0.52, 0.9];
const COMP_P = 0.2;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/* deals: card 1 leaves over p .24–.34, card 2 over .57–.67 */
const deal = (p: number, at: number) => ease(clamp01((p - at) / 0.1));
/* the road: r 0–3 (one unit per segment). Card 2 arrives on "yolda + a bit"
   (the comp's 1.28) and drives to "teslim edildi" by the next deal. */
const roadOf = (p: number) => (p <= 0.36 ? 1.28 : lerp(1.28, 3, ease(clamp01((p - 0.36) / 0.2))));
/* wallets fill over .70–.92 */
const walletOf = (p: number) => ease(clamp01((p - 0.7) / 0.22));
const stepOf = (p: number) => (p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2);

type Mode = "scrub" | "timed" | "off";

/* hydration-safe: "off" until mounted (SSR renders the comp frame) */
function useStepsMode(): Mode {
  const reduced = useReducedMotionSafe();
  const [m, setM] = useState<"wide" | "mid" | "small" | null>(null);
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 921px)");
    const small = window.matchMedia("(max-width: 767px)");
    const update = () => setM(wide.matches ? "wide" : small.matches ? "small" : "mid");
    update();
    wide.addEventListener("change", update);
    small.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      small.removeEventListener("change", update);
    };
  }, []);
  if (reduced || m === null || m === "small") return "off";
  return m === "wide" ? "scrub" : "timed";
}

/** a MotionValue as a CSS custom property, via a derived MotionValue */
function useVar(p: MotionValue<number>, f: (p: number) => number) {
  return useTransform(p, f);
}

function PatternArt({ p }: { p: MotionValue<number> }) {
  // the pattern slides along its own diagonal while 01 is read
  const drift = useVar(p, (v) => clamp01(v / 0.34) * 80 - 24);
  const lift = useVar(p, (v) => 1 + 0.04 * Math.sin(Math.PI * clamp01(v / 0.34)));
  return (
    <div className="dpc-dl__art dpc-dl__art--card">
      <div className="dpc-dl__pattern">
        <motion.div className="dpc-dl__pattern-rot" style={{ "--drift": drift } as never}>
          {PATTERN.map((n, c) => (
            <div key={c} className={clsx("dpc-dl__pattern-col", c === 2 && "dpc-dl__pattern-col--tight")}>
              {Array.from({ length: n }, (_, i) => (
                <img key={i} loading="lazy" src={`${A}/card-tilt.webp`} alt="" width={270} height={410} />
              ))}
            </div>
          ))}
        </motion.div>
      </div>
      {/* the card instance: its face render with the label and mark on top */}
      <motion.div className="dpc-dl__halo" style={{ "--lift": lift } as never}>
        <span className="dpc-dl__face">
          <img loading="lazy" src={`${A}/card-front.webp`} alt="" width={260} height={398} />
          <img loading="lazy" className="dpc-dl__face-debit" src={`${A}/card-debit-label.svg`} alt="" width={32.5} height={9.33891} />
          <img loading="lazy" className="dpc-dl__face-mc" src={`${A}/card-mastercard.svg`} alt="" width={41.6663} height={24.8438} />
        </span>
      </motion.div>
    </div>
  );
}

function TrackingArt({ p }: { p: MotionValue<number> }) {
  const t = DEBIT_DELIVERY.tracking;
  const r = useVar(p, roadOf);
  const cr = useVar(r, (v) => v / 3);
  const f0 = useVar(r, (v) => clamp01(v));
  const f1 = useVar(r, (v) => clamp01(v - 1));
  const f2 = useVar(r, (v) => clamp01(v - 2));
  const fills = [f0, f1, f2];
  // the map eases along with the courier, a few px
  const pan = useVar(r, (v) => (v - 1.28) * -6);
  const [stage, setStage] = useState(1);
  useMotionValueEvent(r, "change", (v) => setStage(v >= 2.98 ? 3 : Math.floor(v)));
  return (
    <div className="dpc-dl__art dpc-dl__art--map">
      <motion.img className="dpc-dl__map" style={{ x: pan }} loading="lazy" src={`${A}/delivery-map-light.webp`} alt="" width={1500} height={1000} />
      <div className="dpc-dl__card">
        <div className="dpc-dl__card-top">
          {/* rolls like a departure board */}
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
                {t.stages[stage]}
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
          <motion.span className="dpc-dl__road" style={{ "--cr": cr } as never}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="dpc-dl__node">
                <img
                  loading="lazy"
                  className="dpc-dl__dot"
                  src={`${A}/${stage >= i ? "stepper-done" : "stepper-todo"}.svg`}
                  alt=""
                  width={18.6589}
                  height={18.6589}
                />
                {i < 3 && <motion.span className="dpc-dl__seg" style={{ "--f": fills[i] } as never} />}
              </span>
            ))}
            <img loading="lazy" className="dpc-dl__courier" src={`${A}/courier.svg`} alt="" width={37.318} height={32.653} />
          </motion.span>
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
  );
}

/* "₺8.501,00" → 8501 */
const toInt = (s: string) => Number(s.replace(/[^\d,]/g, "").split(",")[0]);
const group = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

function WalletRow({ k, v, w, fill }: { k: string; v: { label: string; brand: string; amount: string; total: string }; w: typeof DEBIT_DELIVERY.wallets; fill: MotionValue<number> }) {
  const amt = Number(v.amount);
  const tot = toInt(v.total);
  const amount = useTransform(fill, (f) => group(amt * f));
  // the total climbs by this month's earnings (or a sliver of itself)
  const total = useTransform(fill, (f) => `₺${group(tot - Math.max(amt, tot * 0.03) * (1 - f))},00`);
  return (
    <div className={`dpc-dl__wallet dpc-dl__wallet--${k}`}>
      <img className="dpc-dl__wallet-mark" loading="lazy" src={`${A}/gpara-mark-${k === "iade" ? "a" : "b"}.svg`} alt="" />
      <span className="dpc-dl__wallet-head">
        <span className="dpc-dl__wallet-label">
          <span>{v.label}</span>
          <span className="dpc-dl__wallet-brand">{v.brand}</span>
        </span>
        <span className="dpc-dl__wallet-amount">
          <small>₺</small>
          <motion.span>{amount}</motion.span>
          <small>,00</small>
        </span>
      </span>
      <span className="dpc-dl__wallet-track">
        <motion.span className="dpc-dl__wallet-fill" style={{ "--wf": fill } as never} />
      </span>
      <span className="dpc-dl__wallet-cap">
        <b>
          <small>₺</small>
          {w.cap}
          <small>,00</small>
        </b>{" "}
        {w.unit}
      </span>
      <span className="dpc-dl__wallet-total">
        <span>{w.totalLabel}</span>
        <motion.b>{total}</motion.b>
      </span>
    </div>
  );
}

function WalletArt({ p }: { p: MotionValue<number> }) {
  const w = DEBIT_DELIVERY.wallets;
  // card 3's rest is the comp (full); it only empties while it's coming up
  const fill = useVar(p, (v) => (v < 0.6 ? 1 : walletOf(v)));
  const fillLate = useVar(p, (v) => (v < 0.6 ? 1 : walletOf(v - 0.04)));
  return (
    <div className="dpc-dl__art">
      <WalletRow k="iade" v={w.iade} w={w} fill={fill} />
      <WalletRow k="gp" v={w.getirpara} w={w} fill={fillLate} />
    </div>
  );
}


/* a sheet's place in the stack: depth 0 front … 2 back (comp offsets),
   `out` 0 → 1 as it is dealt off */
function Sheet({ i, p, children }: { i: number; p: MotionValue<number>; children: React.ReactNode }) {
  const out = useVar(p, (v) => (i === 0 ? deal(v, 0.24) : i === 1 ? deal(v, 0.57) : 0));
  const depth = useVar(p, (v) => i - deal(v, 0.24) * Math.min(i, 1) - deal(v, 0.57) * Math.max(0, i - 1));
  const tx = useTransform([depth, out], ([d, o]: number[]) => (d <= 1 ? 33 * d : lerp(33, 60, d - 1)) - 420 * o);
  const ty = useTransform([depth, out], ([d, o]: number[]) => (d <= 1 ? 20 * d : lerp(20, 43, d - 1)) - 70 * o);
  const rot = useTransform([depth, out], ([d, o]: number[]) => 5 * d - 16 * o);
  const op = useTransform(out, (o) => 1 - clamp01((o - 0.35) / 0.65));
  return (
    <motion.div
      className={`dpc-dl__sheet dpc-dl__sheet--${i + 1}`}
      style={{ "--tx": tx, "--ty": ty, "--r": rot, opacity: op } as never}
    >
      {children}
    </motion.div>
  );
}

export default function Delivery() {
  const D = DEBIT_DELIVERY;
  const uid = useId();
  const mode = useStepsMode();
  const reduce = useReducedMotionSafe();
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  /* pin boundaries follow the pin's real height (resize, reflow, fonts) */
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

  // scrub driver: scroll through the pin's travel, through a spring
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", `${SCRUB_PX}px start`] });
  const scrubP = useSpring(scrollYProgress, { stiffness: 150, damping: 22, mass: 1 });

  // timed / off driver: animated to wherever the story should be
  const ownP = useMotionValue(COMP_P);
  const inView = useInView(trackRef, { once: true, margin: "0px 0px -20% 0px" });
  const [manual, setManual] = useState(false);
  useEffect(() => {
    if (mode !== "timed" || !inView || manual) return;
    ownP.set(0);
    const c = animate(ownP, 1, { duration: TIMED_S, ease: "linear" });
    return () => c.stop();
  }, [mode, inView, manual, ownP]);
  // leaving scrub/timed for "off" lands the comp frame
  useEffect(() => {
    if (mode === "off") ownP.set(COMP_P);
  }, [mode, ownP]);

  const scrub = mode === "scrub";
  // which driver is live, as a motion value so `p` recomputes on a mode flip
  const useScrub = useMotionValue(0);
  useEffect(() => useScrub.set(scrub ? 1 : 0), [scrub, useScrub]);
  const p = useTransform([scrubP, ownP, useScrub], ([s, o, on]: number[]) => (on ? clamp01(s) : o));

  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => setActive(stepOf(v)));
  // the open step's rule is its progress (comp: 60% drawn)
  const rule = useVar(p, (v) => clamp01(v * 3 - stepOf(v)));

  const onStep = (i: number) => {
    if (scrub) {
      const track = trackRef.current;
      if (!track) return;
      const top = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + STEP_REST[i] * SCRUB_PX, behavior: reduce ? "auto" : "smooth" });
      return;
    }
    setManual(true);
    animate(ownP, STEP_REST[i], reduce ? { duration: 0 } : { duration: 0.9, ease: [0.16, 1, 0.3, 1] });
  };

  const arts = [<PatternArt key="0" p={p} />, <TrackingArt key="1" p={p} />, <WalletArt key="2" p={p} />];

  return (
    <section className="dpc-dl" data-mode={mode} aria-labelledby={`${uid}-h`}>
      <div className="dpc-container">
        <SectionHead eyebrow={D.eyebrow} title={D.title} sub={D.sub} titleId={`${uid}-h`} />
      </div>

      <div className="dpc-dl__track" ref={trackRef} style={{ "--dpc-scrub": `${SCRUB_PX}px` } as CSSProperties}>
        <div className="dpc-dl__pin" ref={pinRef}>
          <div className="dpc-dl__stage">
            {/* ——— left: the card stack, front card last in the DOM ——— */}
            <Reveal className="dpc-dl__visual">
              <RevealItem>
                <div className="dpc-dl__stack" aria-hidden="true">
                  {D.cards
                    .map((c, i) => (
                      <Sheet key={i} i={i} p={p}>
                        {arts[i]}
                        <div className="dpc-dl__sheet-copy">
                          <p className="dpc-dl__sheet-title">{c.title}</p>
                          {c.desc.length > 0 && (
                            <p className="dpc-dl__sheet-desc">
                              {c.desc.map((l) => (
                                <span key={l}>{l}</span>
                              ))}
                            </p>
                          )}
                        </div>
                      </Sheet>
                    ))
                    .reverse()}
                </div>
              </RevealItem>
            </Reveal>

            {/* ——— right: the three steps ——— */}
            <Reveal className="dpc-dl__steps-col" stagger={0.06}>
              <RevealItem as="span" className="dpc-dl__top-rule" />
              <ol className="dpc-dl__steps">
                {D.steps.map((s, i) => {
                  const on = i === active;
                  return (
                    <RevealItem as="li" key={i} className={clsx("dpc-dl__step", on && "is-active")}>
                      <h3 className="dpc-dl__step-head">
                        <button
                          type="button"
                          aria-expanded={on}
                          aria-controls={s.desc ? `${uid}-s${i}` : undefined}
                          onClick={() => onStep(i)}
                        >
                          <span className="dpc-dl__num">{String(i + 1).padStart(2, "0")}</span>{" "}
                          <span className="dpc-dl__step-text">
                            <span className="dpc-dl__title">{s.title}</span>
                            {s.desc && (
                              <span className="dpc-dl__desc" id={`${uid}-s${i}`} hidden={!on}>
                                {s.desc}
                              </span>
                            )}
                          </span>
                        </button>
                      </h3>
                      <motion.span className="dpc-dl__step-rule" style={on ? ({ "--rp": rule } as never) : undefined} />
                    </RevealItem>
                  );
                })}
              </ol>
              <RevealItem as="p" className="dpc-dl__legal">
                {D.legal}
              </RevealItem>
              <RevealItem>
                <a className="dpc-cta dpc-dl__cta" href={D.href}>
                  {D.cta}
                </a>
              </RevealItem>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
