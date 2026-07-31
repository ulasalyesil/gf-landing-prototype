"use client";
/* Created by Claude — INTERNAL */

import { useSyncExternalStore } from "react";

/* Shared state for the #paranaiyibak placement review (Figma 22041:80165).

   TWO arrangements, exactly one on screen at a time (owner, 2026-07-31):
     "header"  the badge next to the logo on scroll (current main, commit e60995f)
     "drawer"  the persistent bottom bar
   There is deliberately no both-at-once state — the point of the review is to
   choose between them.

   Switching is client-side, NOT navigation. The header badge only exists past
   40px of scroll, so a link or a reload would reset scroll to top and hide the
   very thing under comparison. The URL is still kept in sync with replaceState
   so a team member can copy the address bar and land someone else on the same
   arrangement.

   Singleton store + useSyncExternalStore, matching CardHandoff's phase store.
   Safe here for the same reason: one landing page, one instance of each consumer.

   TEMPORARY — once a placement is chosen, delete this module, ParanaiyibakFlag,
   the [data-gf-pnib] rules and .pnib-flag styles in sections.css, and keep only
   the winning arrangement. */

/** Display order top→bottom in the flag; not the default. */
export const PLACEMENTS = ["header", "drawer"] as const;
export type Placement = (typeof PLACEMENTS)[number];

/* A bare preview link shows the proposal, not today's behaviour — the team is
   being asked to judge the drawer, so it shouldn't need a tap to see it. */
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

export function setPlacement(next: Placement) {
  if (next === placement) return;
  placement = next;
  /* replaceState, not pushState: the flag is a comparison control, so filling
     the back button with placement changes would trap the user. */
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM, next);
  window.history.replaceState(null, "", url);
  listeners.forEach((l) => l());
}

/** Server snapshot is the default, so hydration matches and the client
    reconciles the ?pnib= value straight after — the ?steps= pattern. */
export function usePlacement(): Placement {
  return useSyncExternalStore(subscribe, () => placement, () => DEFAULT_PLACEMENT);
}

/* The flag is a review affordance and must never appear on the real site.
   Hostname-gated rather than env-gated so it needs no Vercel configuration:
   visible on localhost and *.vercel.app previews, hidden on getirfinans.com and
   any subdomain of it. Unknown host → treated as review, since this repo only
   deploys to previews today; tighten to an allowlist if it ever serves prod. */
const subscribeNoop = () => () => {};
const readIsReviewHost = () =>
  !/(^|\.)getirfinans\.com$/i.test(window.location.hostname);

export function useIsReviewHost(): boolean {
  return useSyncExternalStore(subscribeNoop, readIsReviewHost, () => false);
}
