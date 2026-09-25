/* Created by Claude · INTERNAL */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useMotionOff } from "@/components/Reveal";

/* A card you can hold (card pages motion pass). The element tilts toward the
   pointer — springs, so it follows with weight and settles when released —
   and a soft glare slides across it opposite the tilt. On first entering
   view it also swings up from a slight backward lean.

   Fine pointers only; ≤767 and reduced motion get a still card. The parent
   supplies `perspective` (the tilt reads flat without it). */

const MAX = 7; // degrees
const SPRING = { stiffness: 170, damping: 18, mass: 0.6 };

export default function TiltCard({
  className,
  children,
  enterLean = 14,
}: {
  className?: string;
  children: React.ReactNode;
  /** rotateX the card swings up from on entering view (deg) */
  enterLean?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const off = useMotionOff();
  const [fine, setFine] = useState(false);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const lean = useMotionValue(0);
  const rx = useSpring(useTransform(() => (0.5 - py.get()) * 2 * MAX + lean.get()), SPRING);
  const ry = useSpring(useTransform(() => (px.get() - 0.5) * 2 * MAX), SPRING);
  const gx = useTransform(px, (v) => `${(1 - v) * 100}%`);
  const gy = useTransform(py, (v) => `${(1 - v) * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgb(255 255 255 / .28), rgb(255 255 255 / 0) 55%)`;
  const glareOpacity = useSpring(0, SPRING);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // lean back until seen, then swing up (the spring does the motion)
  useEffect(() => {
    if (off) {
      lean.set(0);
      rx.jump(0);
      return;
    }
    if (!inView) {
      lean.set(enterLean);
      rx.jump(enterLean);
    } else lean.set(0);
  }, [off, inView, enterLean, lean, rx]);

  const live = fine && !off;
  const onMove = (e: React.PointerEvent) => {
    if (!live || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    glareOpacity.set(1);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className ? `dpc-tilt ${className}` : "dpc-tilt"}
      style={{ rotateX: rx, rotateY: ry }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
      <motion.span className="dpc-tilt__glare" aria-hidden="true" style={{ backgroundImage: glare, opacity: glareOpacity }} />
    </motion.div>
  );
}
