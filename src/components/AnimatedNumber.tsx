"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  className?: string;
}

export default function AnimatedNumber({
  value,
  suffix = "",
  className,
}: AnimatedNumberProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(elementRef, { once: true, margin: "0px 0px -12% 0px" });
  const [displayValue, setDisplayValue] = useState("0" + suffix);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplayValue(value.toLocaleString("tr-TR") + suffix);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => {
        setDisplayValue(Math.floor(v).toLocaleString("tr-TR") + suffix);
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value, suffix]);

  return (
    <span ref={elementRef} data-count="" className={className}>
      {displayValue}
    </span>
  );
}
