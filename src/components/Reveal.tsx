"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
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

/** True when entrances should be skipped (mobile or reduced motion). */
export function useMotionOff() {
  const reduced = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return Boolean(reduced) || mobile;
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
