"use client";
/* Created by Claude — INTERNAL */

import { useSyncExternalStore } from "react";

/* Shared state for the #paranaiyibak placement review (Figma 22041:80165).

   TWO arrangements, exactly one on screen at a time (owner, 2026-07-31):
     "header"  the badge next to the logo on scroll (current main, commit e60995f)
     "drawer"  the persistent bottom bar
   There is deliberately no both-at-once state — the point of the review is to
   choose between them.

   The arrangement is read once from ?pnib= at module load. It used to be
   switchable at runtime for a live side-by-side; with the on-screen switch gone
   there is no longer anything that mutates it, so the store is now effectively a
   read-only snapshot — the listener plumbing is kept because useSyncExternalStore
   needs a subscribe, not because anything ever notifies.

   Singleton store + useSyncExternalStore, matching CardHandoff's phase store.
   Safe here for the same reason: one landing page, one instance of each consumer.

   The on-screen switch (ParanaiyibakFlag) was removed on 2026-08-20 at the
   owner's request, so "drawer" is now the arrangement everyone sees and
   "header" survives only as ?pnib=header for a side-by-side check.

   TEMPORARY — once a placement is confirmed, delete this module, the
   [data-gf-pnib] rules in sections.css, and keep only the winning
   arrangement. */

/** The two arrangements under review; order is not the default. */
export const PLACEMENTS = ["header", "drawer"] as const;
export type Placement = (typeof PLACEMENTS)[number];

/* A bare preview link shows the proposal, not today's behaviour — the team is
   being asked to judge the drawer, so it shouldn't need a URL param to see it. */
export const DEFAULT_PLACEMENT: Placement = "drawer";

const PARAM = "pnib";
const isPlacement = (v: string): v is Placement =>
  (PLACEMENTS as readonly string[]).includes(v);

/* Initialised at module load, guarded for SSR. Reading here rather than inside
   getSnapshot keeps getSnapshot pure — React may call it several times per
   render and must get the same value back each time. */
let placement: Placement = DEFAULT_PLACEMENT;
if (typeof window !== "undefined") {
  const raw = new URLSearchParams(window.location.search).get(PARAM) ?? "";
  if (isPlacement(raw)) placement = raw;
}

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

/** Server snapshot is the default, so hydration matches and the client
    reconciles the ?pnib= value straight after — the ?steps= pattern. */
export function usePlacement(): Placement {
  return useSyncExternalStore(subscribe, () => placement, () => DEFAULT_PLACEMENT);
}
