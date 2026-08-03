import * as React from "react";

/* Media for the "seçili dijital aboneliklerde %20 nakit iade" tile.
 *
 * Deliberately carries NO third-party brand marks (owner, 2026-08-03): the
 * Figma comp's asset was a logo cluster (spotify / amazon prime / chatgpt) and
 * a big yellow "20%" bubble. Both were dropped — the logos need a cleared
 * source we don't have, and AGENTS.md reserves the % glyph for interest/faiz,
 * so a % bubble on a cashback offer is the wrong mark. The rate lives in the
 * copy (as "%3" already does on the getirpara tile) and the cashback signal is
 * the brand coin, per the same rule.
 *
 * The three tiles carry generic media-category glyphs — play, waveform, spark —
 * not stand-ins for any particular service. They read as "the subscriptions you
 * already pay for" without impersonating one.
 */
const SubscriptionsMotif = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 320 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <defs>
      {/* one tile face, reused at three rotations */}
      <linearGradient id="dpc-sub-face" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.96" />
        <stop offset="1" stopColor="#e6e1f5" stopOpacity="0.9" />
      </linearGradient>
    </defs>

    {/* back tile — waveform (audio) */}
    <g transform="rotate(-9 96 132)">
      <rect x="34" y="74" width="116" height="116" rx="28" fill="url(#dpc-sub-face)" />
      <g stroke="#5d3ebc" strokeWidth="7" strokeLinecap="round" opacity="0.85">
        <path d="M68 132h0" />
        <path d="M80 118v28" />
        <path d="M92 108v48" />
        <path d="M104 120v24" />
        <path d="M116 112v40" />
      </g>
    </g>

    {/* middle tile — spark (assistant / AI) */}
    <g transform="rotate(4 168 108)">
      <rect x="110" y="50" width="116" height="116" rx="28" fill="url(#dpc-sub-face)" />
      <path
        d="M168 76l9 23 23 9-23 9-9 23-9-23-23-9 23-9 9-23z"
        fill="#5d3ebc"
        opacity="0.85"
      />
    </g>

    {/* front tile — play (video) */}
    <g transform="rotate(11 216 150)">
      <rect x="158" y="92" width="116" height="116" rx="28" fill="url(#dpc-sub-face)" />
      <path d="M198 122l38 22-38 22v-44z" fill="#5d3ebc" opacity="0.9" />
    </g>
  </svg>
);

export default SubscriptionsMotif;
