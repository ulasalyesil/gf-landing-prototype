import React from "react";
import clsx from "clsx";

interface AnimatedHighlightProps {
  type?: "hl" | "mark";
  className?: string;
  children: React.ReactNode;
}

export default function AnimatedHighlight({
  type = "hl",
  className,
  children,
}: AnimatedHighlightProps) {
  return (
    <span className={clsx(type, className)}>
      {children}
    </span>
  );
}
