"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Variants, Transition } from "motion/react";

/* Shared entrance system — replaces the per-component GSAP reveal blocks.
   Desktop: whileInView once, triggers when the element top crosses 82% of the
   viewport (the old ScrollTrigger `top 82%`). Mobile ≤767px and
   prefers-reduced-motion: entrances are skipped (content is shown instantly),
   matching the vanilla build's reduced-motion split. Re-evaluates on resize.
   Writes `is-in` on completion — the hl/mark underline draw and the debit
   moped travel hang off that class. */

export const REVEAL_SPRING: Transition = { type: "spring", duration: 0.6, bounce: 0 };
const VIEWPORT_MARGIN = "0px 0px -18% 0px";

type Direction = "up" | "left" | "right" | "none";

const hiddenFor = (direction: Direction) => {
  switch (direction) {
    case "left":
      return { opacity: 0, x: -40 };
    case "right":
      return { opacity: 0, x: 40 };
    case "none":
      return { opacity: 0 };
    default:
      return { opacity: 0, y: 24 };
  }
};

/* Both hooks below are HYDRATION-SAFE: they return false on the server and
   on the first client render, and the real value from the first effect on.
   Motion's useReducedMotion reads the media query during the first client
   render, so any markup or motion prop derived from it differed from the
   server HTML under reduced motion — the long-standing "Reveal hydrates with
   an attribute mismatch" note, and a hard hydration failure once the card
   pages' motion pass made classes and elements depend on it (2026-09-25). */
function useMediaFlag(query: string) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setOn(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return on;
}

/** prefers-reduced-motion, hydration-safe (see above). */
export function useReducedMotionSafe() {
  return useMediaFlag("(prefers-reduced-motion: reduce)");
}

/** True when entrances should be skipped (mobile or reduced motion). */
export function useMotionOff() {
  const reduced = useReducedMotionSafe();
  const mobile = useMediaFlag("(max-width: 767px)");
  return reduced || mobile;
}

const TAGS = {
  div: motion.div,
  header: motion.header,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  span: motion.span,
  p: motion.p,
  h2: motion.h2,
} as const;

type Tag = keyof typeof TAGS;

interface RevealProps {
  as?: Tag;
  direction?: Direction;
  /** Stagger delay between RevealItem children, in seconds. */
  stagger?: number;
  delay?: number;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  id?: string;
  [key: `data-${string}`]: string | undefined;
}

export default function Reveal({
  as = "div",
  direction = "up",
  stagger,
  delay = 0,
  className,
  children,
  style,
  id,
  ...rest
}: RevealProps) {
  const off = useMotionOff();
  const ref = useRef<HTMLElement | null>(null);
  const markIn = () => ref.current?.classList.add("is-in");

  // Entrance skipped → content must still carry is-in for the underline draws.
  useEffect(() => {
    if (off) markIn();
  }, [off]);

  const variants: Variants = {
    hidden: off ? {} : hiddenFor(direction),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: off
        ? { duration: 0 }
        : { ...REVEAL_SPRING, delay, staggerChildren: stagger, delayChildren: stagger ? delay : undefined },
    },
  };

  const M = TAGS[as];
  return (
    <M
      ref={ref as React.Ref<never>}
      id={id}
      className={className}
      style={style}
      {...rest}
      variants={variants}
      initial="hidden"
      {...(off
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, margin: VIEWPORT_MARGIN } })}
      onAnimationComplete={(definition) => {
        if (definition === "visible") markIn();
      }}
    >
      {children}
    </M>
  );
}

/* Child of a staggering Reveal container. Inherits the parent's variant state
   through Motion context — intermediate plain elements are fine. */

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: REVEAL_SPRING },
};

interface RevealItemProps {
  as?: Tag;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function RevealItem({ as = "div", className, children, style }: RevealItemProps) {
  const M = TAGS[as];
  return (
    <M className={className} style={style} variants={itemVariants}>
      {children}
    </M>
  );
}

/* Icon pop recipe (make-interfaces-feel-better §7): scale 0.25 → 1, blur 4 → 0,
   spring with zero bounce. Use inside a RevealItem for icon accents. */
export const iconPopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", duration: 0.3, bounce: 0 },
  },
};
