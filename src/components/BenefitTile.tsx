/* Created by Claude · INTERNAL */
"use client";

import React from "react";
import clsx from "clsx";
import { RevealItem } from "@/components/Reveal";

/* One cell of a product-page bento (card pages v2): a visual over a 20/28
   caption, optional description. Place inside a staggering <Reveal> so the
   tiles enter one after another.
   The visual is decorative — the caption carries the benefit — so it is
   hidden from assistive tech. Photo tiles pass `photo` and an <img alt="">. */

export interface BenefitTileProps {
  visual?: React.ReactNode;
  title: React.ReactNode;
  desc?: React.ReactNode;
  photo?: boolean;
  className?: string;
}

export default function BenefitTile({ visual, title, desc, photo, className }: BenefitTileProps) {
  return (
    <RevealItem as="article" className={clsx("dpc-tile", photo && "dpc-tile--photo", className)}>
      {visual && (
        <div className="dpc-tile__visual" aria-hidden="true">
          {visual}
        </div>
      )}
      <div className="dpc-tile__copy">
        <h3 className="dpc-tile__title">{title}</h3>
        {desc && <p className="dpc-tile__desc">{desc}</p>}
      </div>
    </RevealItem>
  );
}
