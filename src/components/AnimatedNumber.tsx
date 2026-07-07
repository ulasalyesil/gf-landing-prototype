"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const [displayValue, setDisplayValue] = useState("0" + suffix);

  useGSAP(() => {
    if (!elementRef.current) return;
    const obj = { v: 0 };
    
    ScrollTrigger.create({
      trigger: elementRef.current,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: value,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            setDisplayValue(Math.floor(obj.v).toLocaleString("tr-TR") + suffix);
          },
        });
      },
    });
  }, { scope: elementRef });

  return (
    <span ref={elementRef} className={className}>
      {displayValue}
    </span>
  );
}
