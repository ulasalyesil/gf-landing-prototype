/* Created by Claude · INTERNAL */
"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { useInView } from "motion/react";

/* Warm the browser cache for a showcase's other photos once it is near the
   viewport (card pages motion pass). The tab/slider photos wipe in over the
   outgoing one; a still-loading lazy image would wipe in as a blank. */
export function usePreloadImages(ref: RefObject<HTMLElement | null>, srcs: string[]) {
  const near = useInView(ref, { once: true, margin: "0px 0px 50% 0px" });
  const key = srcs.join("|");
  useEffect(() => {
    if (!near) return;
    key.split("|").forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [near, key]);
}
