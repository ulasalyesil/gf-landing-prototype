/* Created by Claude · INTERNAL */
"use client";

import clsx from "clsx";

/* Carousel controls shared by the card pages' sliders (card pages v2).
   Three arrow skins from the comps: `white` (on a photo — taksit), `tint`
   (on white — kampanyalar) and `chevron` (bare — FAQ). The arrow asset is
   drawn pointing left; "next" mirrors it in CSS.
   PageDots is an indicator only: the arrows are the controls, so the dots
   are aria-hidden and carry no hit targets. */

type Skin = "white" | "tint" | "chevron";

export function ArrowButton({
  dir,
  skin = "white",
  label,
  onClick,
  disabled,
  controls,
}: {
  dir: "prev" | "next";
  skin?: Skin;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  /** id of the region this button scrolls/changes */
  controls?: string;
}) {
  const src =
    skin === "chevron"
      ? `/assets/img/kartlar/chevron-${dir === "prev" ? "left" : "right"}.svg`
      : "/assets/img/kartlar/arrow-left.svg";
  return (
    <button
      type="button"
      className={clsx("dpc-arrow", `dpc-arrow--${dir}`, skin !== "white" && `dpc-arrow--${skin}`)}
      aria-label={label}
      aria-controls={controls}
      onClick={onClick}
      disabled={disabled}
    >
      <img src={src} alt="" width={skin === "chevron" ? 40 : 24} height={skin === "chevron" ? 40 : 24} />
    </button>
  );
}

export function PageDots({
  count,
  index,
  skin = "pill",
  className,
}: {
  count: number;
  index: number;
  skin?: "pill" | "ring";
  className?: string;
}) {
  if (count < 2) return null;
  return (
    <span className={clsx("dpc-dots", skin === "ring" && "dpc-dots--ring", className)} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={clsx("dpc-dot", i === index && "is-active")} />
      ))}
    </span>
  );
}
