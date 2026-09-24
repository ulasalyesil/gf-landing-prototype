/* Created by Claude · INTERNAL */
"use client";

import React from "react";
import clsx from "clsx";
import Reveal, { RevealItem } from "@/components/Reveal";

/* Product-page section head: eyebrow pill → title → sub (card pages v2).
   Every section on /kredi-karti and /hesap-karti opens with this, centred by
   default. The comps draw the eyebrow three slightly different ways (border
   tint, weight, fill); `eyebrowClassName` lets a section match its comp
   without the shared rule growing a variant per section. */

export interface SectionHeadProps {
  eyebrow?: React.ReactNode;
  eyebrowClassName?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  align?: "center" | "start";
  className?: string;
  /** id for the h2, so the section can be `aria-labelledby` it */
  titleId?: string;
}

export default function SectionHead({
  eyebrow,
  eyebrowClassName,
  title,
  sub,
  align = "center",
  className,
  titleId,
}: SectionHeadProps) {
  return (
    <Reveal
      as="header"
      className={clsx("dpc-head", align === "start" && "dpc-head--start", className)}
      stagger={0.06}
    >
      {eyebrow && (
        <RevealItem as="span" className={clsx("dpc-eyebrow", eyebrowClassName)}>
          {eyebrow}
        </RevealItem>
      )}
      <div className="dpc-head__text">
        <RevealItem>
          <h2 className="dpc-title" id={titleId}>
            {title}
          </h2>
        </RevealItem>
        {sub && (
          <RevealItem as="p" className="dpc-sub">
            {sub}
          </RevealItem>
        )}
      </div>
    </Reveal>
  );
}
