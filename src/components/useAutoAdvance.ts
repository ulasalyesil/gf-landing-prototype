/* Created by Claude · INTERNAL */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FocusEvent, PointerEvent, RefObject } from "react";
import { animate, useInView, useMotionValue } from "motion/react";
import type { AnimationPlaybackControls, MotionValue } from "motion/react";
import { useMotionOff } from "@/components/Reveal";

/* Timed rotation for the card pages' tabbed showcases (card pages v2).

   - Advances every `interval` ms. `progress` (0→1) is the clock itself, so a
     progress bar bound to it can never drift from the actual switch.
   - Pauses while hovered or while focus is inside, and while off-screen.
   - Stops for good the moment the user picks an item: once someone has taken
     control, content moving under them is the failure (WCAG 2.2.2).
   - Never runs at ≤767 or under reduced motion (`useMotionOff`) — the site's
     standing motion split. `progress` then rests at 1, so a bound bar reads
     as a plain "selected" underline. */

export interface AutoAdvance {
  index: number;
  /** user selection — stops the rotation */
  select: (i: number) => void;
  next: () => void;
  prev: () => void;
  progress: MotionValue<number>;
  /** true while the timer owns the index */
  auto: boolean;
  /** spread onto the container that should pause the rotation */
  bind: {
    onPointerEnter: (e: PointerEvent) => void;
    onPointerLeave: (e: PointerEvent) => void;
    onFocus: () => void;
    onBlur: (e: FocusEvent) => void;
  };
}

export function useAutoAdvance(
  count: number,
  ref: RefObject<HTMLElement | null>,
  interval = 5000
): AutoAdvance {
  const off = useMotionOff();
  const inView = useInView(ref, { amount: 0.35 });
  const [index, setIndex] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [paused, setPaused] = useState(false);
  const progress = useMotionValue(0);
  const ctrl = useRef<AnimationPlaybackControls | null>(null);
  const auto = !off && !stopped && count > 1;

  // one clock per index: run 0 → 1, then hand over to the next item
  useEffect(() => {
    if (!auto) {
      ctrl.current = null;
      progress.set(1);
      return;
    }
    progress.set(0);
    const c = animate(progress, 1, {
      duration: interval / 1000,
      ease: "linear",
      onComplete: () => setIndex((i) => (i + 1) % count),
    });
    ctrl.current = c;
    return () => c.stop();
  }, [index, auto, count, interval, progress]);

  // declared after the clock so it applies to the clock just created
  useEffect(() => {
    const c = ctrl.current;
    if (!c) return;
    if (paused || !inView) c.pause();
    else c.play();
  }, [paused, inView, index, auto]);

  const select = useCallback(
    (i: number) => {
      setStopped(true);
      setIndex(((i % count) + count) % count);
    },
    [count]
  );
  const next = useCallback(() => select(index + 1), [select, index]);
  const prev = useCallback(() => select(index - 1), [select, index]);

  const bind = {
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType === "mouse") setPaused(true);
    },
    onPointerLeave: (e: PointerEvent) => {
      if (e.pointerType === "mouse") setPaused(false);
    },
    onFocus: () => setPaused(true),
    onBlur: (e: FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
    },
  };

  return { index, select, next, prev, progress, auto, bind };
}
