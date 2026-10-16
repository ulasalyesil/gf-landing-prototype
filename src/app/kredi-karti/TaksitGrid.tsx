/* Created by Claude · INTERNAL */
"use client";

import { useId, useRef } from "react";
import clsx from "clsx";
import { motion, useInView } from "motion/react";
import SectionHead from "@/components/SectionHead";
import Parallax from "@/components/Parallax";
import { useMotionOff } from "@/components/Reveal";
import { CREDIT_TAKSIT } from "@/data/content";

/* "ücretsiz 3 taksit" — Web comp 266:6805 (2026-10-16). Replaces the
   category tabs + big photo (TaksitTabs, git history): the meeting of
   2026-09-28 asked for "kampanyaya yönlendirmeyeceğiz, büyük imaj yerine
   daha basit".

   Five photo tiles, 8 apart: two stacked · eczane full height · two
   stacked, each label 34/40 white over a foot shade.

   Motion: the tiles open like windows as the grid comes into view (a clip
   rising off each, the photo settling from a slight zoom), staggered from
   the tall middle one outward; photos counter-drift with the scroll. On
   hover a tile's photo eases in and a "3 taksit" chip rises beside its
   label. ≤767 / reduced motion: the comp, still. */

const EASE = [0.16, 1, 0.3, 1] as const;
/* entrance order: the tall middle first, then its neighbours, then corners */
const ORDER = [2, 3, 0, 1, 4];

export default function TaksitGrid() {
  const T = CREDIT_TAKSIT;
  const uid = useId();
  const off = useMotionOff();
  // the GRID triggers the reveal: a fully clipped tile intersects nothing,
  // so per-tile whileInView never fires
  const gridRef = useRef<HTMLDivElement>(null);
  const seen = useInView(gridRef, { once: true, amount: 0.3 });
  const open = off || seen;
  const [a, b, mid, c, d] = T.tiles;

  const tile = (t: (typeof T.tiles)[number], i: number) => {
    const delay = ORDER.indexOf(i) * 0.09;
    return (
      <motion.figure
        key={t.id}
        className={clsx("ckp-tk__tile", t.tall && "ckp-tk__tile--tall")}
        initial={false}
        animate={{ clipPath: open ? "inset(0% 0% 0% 0% round 32px)" : "inset(100% 0% 0% 0% round 32px)" }}
        transition={off ? { duration: 0 } : { duration: 1, ease: EASE, delay }}
      >
        <motion.div
          className="ckp-tk__zoom"
          initial={false}
          animate={{ scale: open ? 1 : 1.18 }}
          transition={off ? { duration: 0 } : { duration: 1.4, ease: EASE, delay }}
        >
          <Parallax y={i % 2 ? -5 : 5}>
            <img src={t.img} alt="" loading="lazy" />
          </Parallax>
        </motion.div>
        <span className="ckp-tk__shade" />
        <figcaption className="ckp-tk__label">
          <span>{t.label}</span>
          <span className="ckp-tk__chip" aria-hidden="true">
            3 taksit
          </span>
        </figcaption>
      </motion.figure>
    );
  };

  return (
    <section className="dpc-section ckp-tk" aria-labelledby={`${uid}-h`}>
      <div className="dpc-container">
        <SectionHead eyebrow={T.eyebrow} title={T.title} sub={T.sub} titleId={`${uid}-h`} />
        <div className="ckp-tk__grid" ref={gridRef}>
          <div className="ckp-tk__col">
            {tile(a, 0)}
            {tile(b, 1)}
          </div>
          {tile(mid, 2)}
          <div className="ckp-tk__col">
            {tile(c, 3)}
            {tile(d, 4)}
          </div>
        </div>
      </div>
    </section>
  );
}
