/* Created by Claude · INTERNAL */
"use client";

import React from "react";
import type { CSSProperties } from "react";
import { stagger } from "motion/react";
import type { AnimationSequence } from "motion/react";
import { useStory } from "@/components/useStory";
import { Drop, DropInner, FaceGradient, Sheen, useSvgId } from "./filters";

/* Inline hero-title icons for the card pages (were image tags pointing at
   public/assets/img/{kredi,hesap}-karti/hero-icon-*.svg — same
   geometry, split into layers so they can act out their word):

   calendar → the tabs pop, the % draws itself     ("taksit yapan")
   chart    → bars grow, the trend line draws      ("kazandıran")
   card     → the outline draws, the card slides in ("muhteşem kart")
   return   → the calendar lands, its ↳ draws       ("geri dönüşü")

   Each plays once after the headline lands (delays follow reading order)
   and again when hovered. Motion off: the comp, still. */

const EASE = [0.16, 1, 0.3, 1] as const;
const POP = { type: "spring", duration: 0.45, bounce: 0.45 } as const;

function Icon({
  className = "",
  style,
  delay,
  sequence,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  delay: number;
  sequence: AnimationSequence;
  children: React.ReactNode;
}) {
  const scope = useStory<HTMLSpanElement>(sequence, { delay, amount: 0.6, hoverTarget: "self", rewind: 0.18 });
  return (
    <span ref={scope} className={`dpc-hero__icon ${className}`} style={style}>
      {children}
    </span>
  );
}

/** credit "taksit yapan" — calendar with its % (the glyph was a separate layer) */
export function CalendarPercentIcon({ delay = 0.8 }: { delay?: number }) {
  const u = useSvgId();
  const seq: AnimationSequence = [
    [".hi-tab", { y: [-6, 0], opacity: [0, 1] }, { ...POP, delay: stagger(0.07) }],
    [".hi-slash", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.35, ease: EASE, at: "-0.2" }],
    [".hi-dot", { scale: [0.2, 1], opacity: [0, 1] }, { ...POP, delay: stagger(0.08) }],
  ];
  return (
    <Icon delay={delay} sequence={seq} style={{ "--icon-h": "0.891em", "--icon-y": "-0.14em" } as CSSProperties}>
      <svg viewBox="0 0 59.8 57.03" width="59.8" height="57.03" fill="none" aria-hidden="true">
        <path d="M0 14.58C0 9.27 4.31 4.96 9.62 4.96H50.18C55.49 4.96 59.8 9.27 59.8 14.58V45.18C59.8 50.49 55.49 54.8 50.18 54.8H9.62C4.31 54.8 0 50.49 0 45.18V14.58Z" fill="#5D3EBC" />
        <g filter={`url(#a-${u})`}>
          <rect x="4.98" y="9.95" width="49.83" height="39.87" rx="7.21" fill={`url(#f-${u})`} />
        </g>
        <g filter={`url(#b-${u})`}>
          <path className="hi-tab" d="M18.51 2.47V9.95" stroke="#FFD300" strokeWidth="4.94" strokeLinecap="round" />
        </g>
        <g filter={`url(#c-${u})`}>
          <path className="hi-tab" d="M42.53 2.47V9.95" stroke="#FFD300" strokeWidth="4.94" strokeLinecap="round" />
        </g>
        <path d="M49.83 19.74C49.83 17.08 47.68 14.93 45.02 14.93H14.77C12.12 14.93 9.96 17.08 9.96 19.74V27.39H49.83V19.74Z" fill={`url(#s-${u})`} fillOpacity="0.2" />
        {/* the % — Figma's separate glyph layer, at its offset in the icon */}
        <g transform="translate(20.99 21.84)" filter={`url(#g-${u})`}>
          <path className="hi-slash" d="M4.02 15.37L16.41 2.97" stroke="white" strokeWidth="4.39" strokeLinecap="round" />
          <circle className="hi-dot" cx="16.47" cy="15.43" r="0.71" stroke="white" strokeWidth="4.39" />
          <circle className="hi-dot" cx="3.96" cy="2.9" r="0.71" stroke="white" strokeWidth="4.39" />
        </g>
        <defs>
          <DropInner id={`a-${u}`} x={0.18} y={7.54} w={59.45} h={49.48} dy={2.4} blur={2.4} hi={0.72} hiBlur={0.6} />
          <Drop id={`b-${u}`} x={16.04} y={-8} w={9.88} h={25.36} dx={2.47} dy={2.47} blur={1.24} a={0.2} />
          <Drop id={`c-${u}`} x={40.06} y={-8} w={9.88} h={25.36} dx={2.47} dy={2.47} blur={1.24} a={0.2} />
          <Drop id={`g-${u}`} x={-2} y={-2} w={24.43} h={24.45} dy={1.06} blur={0.53} a={0.15} />
          <FaceGradient id={`f-${u}`} x1={66.32} y1={-11.09} x2={12.81} y2={30.32} />
          <Sheen id={`s-${u}`} x1={42.08} y1={21.16} x2={9.96} y2={21.16} />
        </defs>
      </svg>
    </Icon>
  );
}

/** credit "kazandıran" — rising bars under a trend arrow */
export function ChartIcon({ delay = 0.95 }: { delay?: number }) {
  const seq: AnimationSequence = [
    [".hi-bar", { scaleY: [0, 1] }, { duration: 0.5, ease: EASE, delay: stagger(0.06) }],
    [".hi-trend", { opacity: [0, 1] }, { duration: 0.01, at: "-0.3" }],
    [".hi-trend", { pathLength: [0, 1] }, { duration: 0.5, ease: EASE, at: "<" }],
    [".hi-head", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.22, ease: EASE, at: "-0.08" }],
  ];
  const bars = [
    [1.67, 48.64, 5.39],
    [15.15, 44.59, 9.43],
    [28.63, 37.85, 16.17],
    [42.11, 31.11, 22.91],
    [55.58, 23.03, 31],
  ];
  return (
    <Icon delay={delay} sequence={seq} style={{ "--icon-h": "0.844em", "--icon-y": "-0.15em" } as CSSProperties}>
      <svg viewBox="0 0 64.05 54.03" width="64.05" height="54.03" fill="none" aria-hidden="true">
        {bars.map(([x, y, h]) => (
          <rect key={x} className="hi-bar" x={x} y={y} width="8.09" height={h} rx="1.35" fill="#5D3EBC" />
        ))}
        <path className="hi-trend" d="M2.02 31.01C26.96 31.01 49.87 25.72 59.3 2.81" stroke="#FFD300" strokeWidth="4.04" strokeLinecap="round" />
        <path className="hi-head" d="M50.94 5.47L58.84 2.13C59.64 1.79 60.56 2.29 60.7 3.16L62.03 11.34" stroke="#FFD300" strokeWidth="4.04" strokeLinecap="round" />
      </svg>
    </Icon>
  );
}

/** both pages' card — drawn landscape, turned upright in CSS (`--rot`) */
export function CardIcon({ delay = 1.1 }: { delay?: number }) {
  const u = useSvgId();
  const seq: AnimationSequence = [
    [".hi-outline", { opacity: [0, 1] }, { duration: 0.01 }],
    [".hi-outline", { pathLength: [0, 1] }, { duration: 0.5, ease: EASE, at: "<" }],
    [".hi-card", { x: [-8, 0], y: [-10, 0], rotate: [-12, 0], opacity: [0, 1] }, { type: "spring", duration: 0.65, bounce: 0.35, at: "-0.25" }],
    [".hi-chip", { scale: [0.3, 1], opacity: [0, 1] }, { ...POP, at: "-0.3" }],
  ];
  return (
    <Icon delay={delay} sequence={seq} className="dpc-hero__icon--rot" style={{ "--icon-y": "-0.24em" } as CSSProperties}>
      <svg viewBox="0 0 72.4 64.25" width="72.4" height="64.25" fill="none" aria-hidden="true">
        <path
          className="hi-outline"
          d="M50.42 47.06L55.8 26.29C56.22 24.66 55.96 22.91 55.08 21.44C54.2 19.96 52.76 18.87 51.09 18.41L19.61 9.72C17.95 9.26 16.18 9.47 14.7 10.3C13.22 11.13 12.15 12.51 11.73 14.15L6.95 32.58C6.07 35.98 8.16 39.52 11.64 40.49L17.93 42.22"
          stroke="#FFD300" strokeWidth="3.04" strokeLinecap="round" strokeLinejoin="round"
        />
        <g className="hi-card">
          <rect x="14.56" y="60.57" width="40.52" height="56.73" rx="8.73" transform="rotate(-90 14.56 60.57)" fill="#5D3EBC" />
          <g filter={`url(#a-${u})`}>
            <rect x="18.61" y="56.52" width="32.42" height="48.63" rx="6.55" transform="rotate(-90 18.61 56.52)" fill={`url(#f-${u})`} />
          </g>
          <path d="M22.29 48.1C22.29 50.51 24.24 52.47 26.65 52.47H58.45C60.86 52.47 62.81 50.51 62.81 48.1V42.34H22.29V48.1Z" fill={`url(#s-${u})`} fillOpacity="0.2" />
          <g className="hi-chip" filter={`url(#b-${u})`}>
            <path d="M51.03 41.32C51.03 40.43 51.27 39.59 51.67 38.86C52.83 39.94 54.39 40.6 56.1 40.6C57.81 40.6 59.36 39.94 60.53 38.86C60.93 39.59 61.16 40.43 61.16 41.32C61.16 44.12 58.9 46.39 56.1 46.39C53.3 46.39 51.03 44.12 51.03 41.32Z" fill="white" />
            <circle cx="56.1" cy="33.22" r="5.07" fill="white" />
          </g>
        </g>
        <defs>
          <DropInner id={`a-${u}`} x={13.46} y={21.52} w={58.94} h={42.73} dy={2.58} blur={2.58} hi={0.77} hiBlur={0.64} />
          <Drop id={`b-${u}`} x={50.02} y={28.15} w={12.16} h={20.26} dy={1.01} blur={0.51} a={0.15} />
          <FaceGradient id={`f-${u}`} x1={58.52} y1={30.85} x2={10.96} y2={50.48} />
          <Sheen id={`s-${u}`} x1={22.29} y1={47.4} x2={52.68} y2={47.4} reverse />
        </defs>
      </svg>
    </Icon>
  );
}

/** debit "geri dönüşü" — calendar over its outline, with a return arrow */
export function CalendarReturnIcon({ delay = 0.8 }: { delay?: number }) {
  const u = useSvgId();
  const seq: AnimationSequence = [
    [".hi-outline", { opacity: [0, 1] }, { duration: 0.01 }],
    [".hi-outline", { pathLength: [0, 1] }, { duration: 0.5, ease: EASE, at: "<" }],
    [".hi-cal", { x: [7, 0], y: [7, 0], opacity: [0, 1] }, { type: "spring", duration: 0.55, bounce: 0.3, at: "-0.3" }],
    [".hi-tab", { y: [-6, 0], opacity: [0, 1] }, { ...POP, delay: stagger(0.07), at: "-0.2" }],
    [".hi-return", { opacity: [0, 1] }, { duration: 0.01, at: "-0.1" }],
    [".hi-return", { pathLength: [0, 1] }, { duration: 0.35, ease: EASE, at: "<" }],
    [".hi-return-head", { pathLength: [0, 1], opacity: [0, 1] }, { duration: 0.2, ease: EASE }],
  ];
  return (
    <Icon delay={delay} sequence={seq} style={{ "--icon-h": "0.9em", "--icon-y": "-0.16em" } as CSSProperties}>
      <svg viewBox="0 0 62.72 58.24" width="62.72" height="58.24" fill="none" aria-hidden="true">
        <rect className="hi-outline" x="19.6" y="19.6" width="41.44" height="36.96" rx="5.04" stroke="#FFD300" strokeWidth="3.36" />
        <g className="hi-cal">
          <path d="M0 13.2C0 8.38 3.9 4.48 8.72 4.48H45.04C49.86 4.48 53.76 8.38 53.76 13.2V40.56C53.76 45.38 49.86 49.28 45.04 49.28H8.72C3.9 49.28 0 45.38 0 40.56V13.2Z" fill="#5D3EBC" />
          <g filter={`url(#a-${u})`}>
            <rect x="4.48" y="8.96" width="44.8" height="35.84" rx="6.54" fill={`url(#f-${u})`} />
          </g>
          <g filter={`url(#b-${u})`}>
            <path className="hi-tab" d="M16.64 2.24V8.96" stroke="#FFD300" strokeWidth="4.48" strokeLinecap="round" />
          </g>
          <g filter={`url(#c-${u})`}>
            <path className="hi-tab" d="M38.24 2.24V8.96" stroke="#FFD300" strokeWidth="4.48" strokeLinecap="round" />
          </g>
          <path d="M44.8 17.8C44.8 15.39 42.85 13.44 40.44 13.44H13.32C10.92 13.44 8.96 15.39 8.96 17.8V24.64H44.8V17.8Z" fill={`url(#s-${u})`} fillOpacity="0.2" />
          <g filter={`url(#d-${u})`}>
            <path className="hi-return" d="M20.16 19.62V28.82C20.16 30.04 21.15 31.02 22.37 31.02H33.41" stroke="#F9F7FF" strokeWidth="3.36" strokeLinecap="round" />
            <path className="hi-return-head" d="M31.2 26.61L35.46 30.87C35.55 30.95 35.55 31.09 35.46 31.18L31.2 35.44" stroke="#F9F7FF" strokeWidth="3.36" strokeLinecap="round" />
          </g>
        </g>
        <defs>
          <DropInner id={`a-${u}`} x={0.12} y={6.78} w={53.52} h={44.56} dy={2.18} blur={2.18} hi={0.65} hiBlur={0.54} />
          <Drop id={`b-${u}`} x={14.4} y={-8} w={8.96} h={23.68} dx={2.24} dy={2.24} blur={1.12} a={0.2} />
          <Drop id={`c-${u}`} x={36} y={-8} w={8.96} h={23.68} dx={2.24} dy={2.24} blur={1.12} a={0.2} />
          <Drop id={`d-${u}`} x={17.36} y={17.94} w={20.97} h={21.42} dy={1.12} blur={0.56} a={0.15} />
          <FaceGradient id={`f-${u}`} x1={59.62} y1={-9.96} x2={11.52} y2={27.28} />
          <Sheen id={`s-${u}`} x1={37.84} y1={19.04} x2={8.96} y2={19.04} />
        </defs>
      </svg>
    </Icon>
  );
}
