/* Created by Claude · INTERNAL */
"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useAnimate, useInView, isMotionValue } from "motion/react";
import type { AnimationPlaybackControls, AnimationSequence, MotionValue } from "motion/react";
import { useMotionOff } from "@/components/Reveal";

/* Micro-stories for illustrations (card pages motion pass, 2026-09-25).

   A story is a Motion AnimationSequence scoped to one illustration: each
   segment is [selector | MotionValue, keyframes, options]. Every animated
   property MUST be written as an explicit [from, …, to] array — the engine
   reads index 0 as the primed start and the last entry as the rest state.
   The rest state is the comp: SSR, ≤767 and reduced motion render it as-is
   and the story never runs (the site's standing motion split).

   - prime:  on mount (motion on) every property jumps to its first keyframe.
             The illustration is still hidden by its Reveal, so nothing flashes.
   - play:   once, when the scope is `amount` in view, after `delay` — long
             enough for the tile's own Reveal entrance to settle first.
   - replay: when the pointer rests on `hoverTarget` (the enclosing tile by
             default) for INTENT_MS it rewinds to the primed state in `rewind`
             s, then plays again. Ignored while a run is in flight and for
             COOLDOWN_MS after one ends — sweeping the mouse across a bento
             must not set every tile off.
   - loops:  ambient animations ([selector, keyframes, options] each, with
             `repeat: Infinity`), started after the first run, paused while
             off-screen, stopped for a replay and restarted after it. Their
             first keyframe must be the rest state too.
   - motion flips off mid-run (resize to ≤767): everything stops and jumps
             to the rest state. */

type Subject = string | MotionValue<number>;
const INTENT_MS = 150;
const COOLDOWN_MS = 2500;
type Keyframes = Record<string, unknown> | unknown;

export interface StoryOptions {
  /** seconds after entering view before the first run */
  delay?: number;
  /** fraction of the scope that must be visible */
  amount?: number;
  replayOnHover?: boolean;
  /** "tile" = nearest `.dpc-tile` (falls back to the scope), "self" = the scope */
  hoverTarget?: "tile" | "self";
  /** seconds spent rewinding before a replay */
  rewind?: number;
  /** ambient loops, started once the first run completes */
  loops?: LoopDef[];
}

export type LoopDef = [string, Record<string, unknown[]>, Record<string, unknown>];

type Segment = [Subject, Keyframes, Record<string, unknown>?];

/* first-or-last keyframe of every animated property, first appearance wins
   for "first" and last appearance wins for "last" */
function edgeState(sequence: AnimationSequence, edge: "first" | "last") {
  const out = new Map<Subject, Record<string, unknown> | number>();
  const segs = (edge === "first" ? [...sequence].reverse() : sequence) as unknown as Segment[];
  for (const seg of segs) {
    if (!Array.isArray(seg)) continue;
    const [subject, frames] = seg;
    if (isMotionValue(subject)) {
      const arr = frames as unknown[];
      const v = Array.isArray(arr) ? (edge === "first" ? arr[0] : arr[arr.length - 1]) : arr;
      out.set(subject, v as number);
      continue;
    }
    const cur = (out.get(subject) as Record<string, unknown>) ?? {};
    for (const [k, v] of Object.entries(frames as Record<string, unknown>)) {
      if (!Array.isArray(v)) continue;
      cur[k] = edge === "first" ? v[0] : v[v.length - 1];
    }
    out.set(subject, cur);
  }
  return out;
}

export function useStory<T extends HTMLElement = HTMLDivElement>(
  sequence: AnimationSequence,
  { delay = 0.35, amount = 0.5, replayOnHover = true, hoverTarget = "tile", rewind = 0.28, loops }: StoryOptions = {}
) {
  const [scope, animate] = useAnimate<T>();
  const off = useMotionOff();
  const seen = useInView(scope, { once: true, amount });
  const visible = useInView(scope, { amount: 0 });
  // latest story + loops without re-running effects (callers pass literals)
  const seqRef = useRef(sequence);
  const loopsRef = useRef(loops);
  useLayoutEffect(() => {
    seqRef.current = sequence;
    loopsRef.current = loops;
  });
  const running = useRef<AnimationPlaybackControls | null>(null);
  const loopCtl = useRef<AnimationPlaybackControls[] | null>(null);
  const played = useRef(false);
  const endedAt = useRef(0);

  const jump = useCallback(
    (edge: "first" | "last", duration = 0) => {
      const state = edgeState(seqRef.current, edge);
      const ctl: AnimationPlaybackControls[] = [];
      state.forEach((values, subject) => {
        if (isMotionValue(subject)) {
          if (duration) ctl.push(animate(subject, values as number, { duration, ease: "easeOut" }));
          else subject.set(values as number);
          return;
        }
        if (!scope.current || !scope.current.querySelector(subject as string)) return;
        ctl.push(animate(subject as string, values as never, { duration, ease: [0.16, 1, 0.3, 1] }));
      });
      return Promise.all(ctl.map((c) => c.finished));
    },
    [animate, scope]
  );

  const stopLoops = useCallback(() => {
    loopCtl.current?.forEach((c) => c.stop());
    loopCtl.current = null;
  }, []);

  const startLoops = useCallback(() => {
    const defs = loopsRef.current;
    if (!defs || loopCtl.current || !scope.current) return;
    loopCtl.current = defs
      .filter(([sel]) => scope.current?.querySelector(sel))
      .map(([sel, frames, opts]) => animate(sel, frames as never, opts as never));
  }, [animate, scope]);

  const play = useCallback(async () => {
    if (running.current) return;
    const c = animate(seqRef.current);
    running.current = c;
    try {
      await c.finished;
    } finally {
      running.current = null;
      endedAt.current = performance.now();
    }
    played.current = true;
    startLoops();
  }, [animate, startLoops]);

  // prime / settle with the motion mode
  useEffect(() => {
    if (off) {
      running.current?.stop();
      running.current = null;
      stopLoops();
      // loops may have moved properties the story doesn't own; land both
      loopsRef.current?.forEach(([sel, frames]) => {
        if (!scope.current?.querySelector(sel)) return;
        const rest = Object.fromEntries(Object.entries(frames).map(([k, v]) => [k, v[0]]));
        animate(sel, rest as never, { duration: 0 });
      });
      void jump("last");
      return;
    }
    if (!played.current && !running.current) void jump("first");
  }, [off, jump, animate, scope, stopLoops]);

  // first run
  useEffect(() => {
    if (off || !seen || played.current) return;
    const t = window.setTimeout(() => void play(), delay * 1000);
    return () => window.clearTimeout(t);
  }, [off, seen, delay, play]);

  // loops only while on-screen
  useEffect(() => {
    loopCtl.current?.forEach((c) => (visible ? c.play() : c.pause()));
  }, [visible]);

  // hover replay
  useEffect(() => {
    if (off || !replayOnHover) return;
    const root = scope.current;
    if (!root) return;
    const target = hoverTarget === "tile" ? ((root.closest(".dpc-tile") as HTMLElement | null) ?? root) : root;
    let intent = 0;
    const replay = async () => {
      if (!played.current || running.current || performance.now() - endedAt.current < COOLDOWN_MS) return;
      stopLoops();
      const rewinding = jump("first", rewind);
      running.current = { stop() {} } as AnimationPlaybackControls; // lock during the rewind
      await rewinding;
      running.current = null;
      void play();
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      window.clearTimeout(intent);
      intent = window.setTimeout(() => void replay(), INTENT_MS);
    };
    const onLeave = () => window.clearTimeout(intent);
    target.addEventListener("pointerenter", onEnter);
    target.addEventListener("pointerleave", onLeave);
    return () => {
      window.clearTimeout(intent);
      target.removeEventListener("pointerenter", onEnter);
      target.removeEventListener("pointerleave", onLeave);
    };
  }, [off, replayOnHover, hoverTarget, rewind, jump, play, scope, stopLoops]);

  return scope;
}
