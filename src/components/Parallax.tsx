/* Created by Claude · INTERNAL */
"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useMotionOff } from "@/components/Reveal";

/* Scroll-linked drift for a photo inside a clipping frame (card pages motion
   pass). Drop it inside the frame (`overflow: hidden`, positioned) around the
   photo: it fills the frame and moves as the frame crosses the viewport.

   - `y`: percent of the frame's height, travelled end-to-end ([-y, +y]);
     negative runs the other way, for neighbours that should counter-drift.
   - `zoom`: scale at the moment the frame enters, easing to 1 as it leaves
     the viewport's middle — the photo "settles" into place.
   Overscan is built in (scale ≥ 1 + 2y) so the drift never shows an edge.

   Motion off (≤767, reduced motion): the transforms read their rest value.
   An `enabled` motion value gates them rather than swapping `style`, so the
   SSR markup and every later render agree. */

export default function Parallax({
  y = 0,
  zoom = 1,
  className,
  children,
}: {
  y?: number;
  zoom?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const off = useMotionOff();
  const enabled = useMotionValue(0);
  useEffect(() => {
    enabled.set(off ? 0 : 1);
  }, [off, enabled]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const overscan = 1 + (2 * Math.abs(y)) / 100;
  const ty = useTransform(() => (enabled.get() ? `${(scrollYProgress.get() * 2 - 1) * y}%` : "0%"));
  const scale = useTransform(() => {
    if (!enabled.get()) return 1;
    const settle = Math.min(1, scrollYProgress.get() / 0.5);
    return (zoom + (1 - zoom) * settle) * overscan;
  });

  return (
    <motion.div ref={ref} className={className ? `dpc-parallax ${className}` : "dpc-parallax"} style={{ y: ty, scale }}>
      {children}
    </motion.div>
  );
}
