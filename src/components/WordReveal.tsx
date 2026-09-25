/* Created by Claude · INTERNAL */
"use client";

import React from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { useMotionOff } from "@/components/Reveal";

/* Section titles rise word by word out of a mask (card pages motion pass).
   Rides the enclosing Reveal's variant state, so it plays when the head
   enters and in the head's own stagger order (eyebrow → title → sub).
   Words keep real spaces between them, so the heading's accessible name is
   the plain sentence. The markup is identical in every motion mode; motion
   off only swaps the variants to no-ops (no hydration mismatch). */

const PARENT: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.045 } } };
const WORD: Variants = {
  hidden: { y: "108%" },
  visible: { y: "0%", transition: { type: "spring", duration: 0.75, bounce: 0 } },
};
/* motion off: words rest in place — explicit, because the first render (and
   the server HTML) used WORD's hidden pose and something has to undo it */
const STILL: Variants = { hidden: { y: "0%" }, visible: { y: "0%", transition: { duration: 0 } } };

export default function WordReveal({ text }: { text: string }) {
  const off = useMotionOff();
  const words = text.split(" ");
  return (
    <motion.span className="dpc-words" variants={off ? STILL : PARENT}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          {i > 0 && " "}
          <span className="dpc-word">
            <motion.span className="dpc-word__in" variants={off ? STILL : WORD}>
              {w}
            </motion.span>
          </span>
        </React.Fragment>
      ))}
    </motion.span>
  );
}
