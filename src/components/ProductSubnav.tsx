/* Created by Claude · INTERNAL */
"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { PRODUCT_SUBNAV } from "@/data/content";

/* Product index row under the site header (card pages v2, Figma
   "Breadcrumb" 22630:15278). In flow, not fixed — see `.dpc-subnav` in
   product-page.css. `current` marks the section this page belongs to; the
   comp draws no active state, so it is announced (aria-current) but not
   styled.

   Motion pass (2026-09-25): the hover underline is one line that slides
   from link to link (shared layout) instead of each link drawing its own,
   so skimming the row reads as one gesture. Mouse only; it leaves with the
   pointer. Keyboard focus keeps the page's focus ring. */

export default function ProductSubnav({ current }: { current?: string }) {
  const uid = useId();
  const [hover, setHover] = useState<string | null>(null);
  return (
    <nav className="dpc-subnav" aria-label="ürünler">
      <div className="container dpc-subnav__inner">
        <span className="dpc-subnav__label" aria-hidden="true">
          {PRODUCT_SUBNAV.label}
        </span>
        <ul className="dpc-subnav__list" onPointerLeave={() => setHover(null)}>
          {PRODUCT_SUBNAV.items.map((item) => {
            const isCurrent = item.id === current;
            const props = {
              className: "dpc-subnav__link",
              "aria-current": isCurrent ? ("true" as const) : undefined,
              onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setHover(item.id),
            };
            const line = hover === item.id && (
              <motion.span
                layoutId={`${uid}-line`}
                className="dpc-subnav__line"
                aria-hidden="true"
                transition={{ type: "spring", duration: 0.35, bounce: 0 }}
              />
            );
            return (
              <li key={item.id}>
                {item.href.startsWith("/") ? (
                  <Link href={item.href} {...props}>
                    {item.label}
                    {line}
                  </Link>
                ) : (
                  <a href={item.href} {...props}>
                    {item.label}
                    {line}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
