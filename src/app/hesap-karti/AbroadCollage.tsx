"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { REVEAL_SPRING, useMotionOff } from "@/components/Reveal";

/* Abroad collage entrance (GFDES-2174 §4)
   - The debit card render pops in when the collage scrolls into view (once).
   - When the card's entrance COMPLETES (onAnimationComplete — not section
     in-view), the city photos pop in one by one.
   - Lisbon (img-3) then Berlin (img-5) are fixed anchors, in that order;
     the remaining photos (1, 2, 4) follow in an order randomized ONCE per
     page load (state initializer) — re-entering the viewport never
     re-triggers or re-shuffles.
   - Pop = fade + scale .92→1 (never from 0), constant 80ms stagger.
   - Mobile ≤767 / reduced motion: everything shown instantly (project split). */

interface CollageImg {
  cls: string;
  src: string;
  w: number;
  h: number;
}

const CARD: CollageImg = { cls: "dpc-abroad__img-card", src: "/assets/img/debit-card-render.png", w: 216, h: 328 };
const LISBON: CollageImg = { cls: "dpc-abroad__img-3", src: "/assets/img/debit-abroad-3.png", w: 240, h: 174 };
const BERLIN: CollageImg = { cls: "dpc-abroad__img-5", src: "/assets/img/debit-abroad-5.png", w: 190, h: 256 };
const REST: CollageImg[] = [
  { cls: "dpc-abroad__img-1", src: "/assets/img/debit-abroad-1.png", w: 170, h: 256 },
  { cls: "dpc-abroad__img-2", src: "/assets/img/debit-abroad-2.png", w: 240, h: 174 },
  { cls: "dpc-abroad__img-4", src: "/assets/img/debit-abroad-4.png", w: 256, h: 170 },
];

const STAGGER = 0.08;
const POP = { type: "spring", duration: 0.5, bounce: 0.25 } as const;

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AbroadCollage() {
  const off = useMotionOff();
  const [photos] = useState<CollageImg[]>(() => [LISBON, BERLIN, ...shuffled(REST)]);
  const [started, setStarted] = useState(false);

  return (
    <div className="dpc-abroad__collage">
      {photos.map((img, i) => (
        <motion.img
          key={img.cls}
          className={img.cls}
          src={img.src}
          alt=""
          width={img.w}
          height={img.h}
          loading="lazy"
          initial={off ? false : { opacity: 0, scale: 0.92 }}
          animate={off || started ? { opacity: 1, scale: 1 } : undefined}
          transition={{ ...POP, delay: i * STAGGER }}
        />
      ))}
      <motion.img
        className={CARD.cls}
        src={CARD.src}
        alt=""
        width={CARD.w}
        height={CARD.h}
        loading="lazy"
        initial={off ? false : { opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -18% 0px" }}
        transition={REVEAL_SPRING}
        onAnimationComplete={() => setStarted(true)}
      />
    </div>
  );
}
