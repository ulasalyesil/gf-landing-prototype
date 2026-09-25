/* Created by Claude · INTERNAL */
import { useId } from "react";

/* The two shadow filters Figma exports for every GF icon, as components, so
   inlined art stays readable. Values are the export's, per call site. */

/** useId() made safe for `url(#…)` references */
export function useSvgId() {
  return useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

type Box = { id: string; x: number; y: number; w: number; h: number };

const ALPHA = "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0";

/** drop shadow (dx, dy, blur, alpha) */
export function Drop({ id, x, y, w, h, dx = 0, dy, blur, a }: Box & { dx?: number; dy: number; blur: number; a: number }) {
  return (
    <filter id={id} x={x} y={y} width={w} height={h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="bg" />
      <feColorMatrix in="SourceAlpha" type="matrix" values={ALPHA} result="hardAlpha" />
      <feOffset dx={dx} dy={dy} />
      <feGaussianBlur stdDeviation={blur} />
      <feComposite in2="hardAlpha" operator="out" />
      <feColorMatrix type="matrix" values={`0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${a} 0`} />
      <feBlend mode="normal" in2="bg" result="drop" />
      <feBlend mode="normal" in="SourceGraphic" in2="drop" result="shape" />
    </filter>
  );
}

/** drop shadow + the white inner highlight on the top-left edge */
export function DropInner({
  id, x, y, w, h, dy, blur, a = 0.25, hi, hiBlur,
}: Box & { dy: number; blur: number; a?: number; hi: number; hiBlur: number }) {
  return (
    <filter id={id} x={x} y={y} width={w} height={h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="bg" />
      <feColorMatrix in="SourceAlpha" type="matrix" values={ALPHA} result="hardAlpha" />
      <feOffset dy={dy} />
      <feGaussianBlur stdDeviation={blur} />
      <feComposite in2="hardAlpha" operator="out" />
      <feColorMatrix type="matrix" values={`0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${a} 0`} />
      <feBlend mode="normal" in2="bg" result="drop" />
      <feBlend mode="normal" in="SourceGraphic" in2="drop" result="shape" />
      <feColorMatrix in="SourceAlpha" type="matrix" values={ALPHA} result="hardAlpha2" />
      <feOffset dx={-hi} dy={hi} />
      <feGaussianBlur stdDeviation={hiBlur} />
      <feComposite in2="hardAlpha2" operator="arithmetic" k2="-1" k3="1" />
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
      <feBlend mode="normal" in2="shape" />
    </filter>
  );
}

/** the GF card face gradient (lilac → purple) */
export function FaceGradient({ id, x1, y1, x2, y2 }: { id: string; x1: number; y1: number; x2: number; y2: number }) {
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
      <stop stopColor="#C8BEE7" />
      <stop offset="1" stopColor="#5D3EBC" />
    </linearGradient>
  );
}

/** the white sheen over a card face (fades one way) */
export function Sheen({ id, x1, y1, x2, y2, reverse }: { id: string; x1: number; y1: number; x2: number; y2: number; reverse?: boolean }) {
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
      <stop stopColor="white" stopOpacity={reverse ? 1 : 0} />
      <stop offset="1" stopColor="white" stopOpacity={reverse ? 0 : 1} />
    </linearGradient>
  );
}
