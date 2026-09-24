/* Created by Claude · INTERNAL */
"use client";

import { useId } from "react";
import SectionHead from "@/components/SectionHead";
import Reveal, { RevealItem } from "@/components/Reveal";
import { DEBIT_SANAL } from "@/data/content";

/* "sanal hesap kartıyla güvenle harca" (card pages v2, Figma 22630:16495).
   Pale-yellow field, three frosted feature cards on the left, the hand-held
   virtual card with three rotated outline rings on the right, all fading to
   white at the foot. The art is positioned from the stage's centre in comp px
   (`--u`), so it tracks the column rather than the viewport edge.

   Feature glyphs: each is a 2×2 of 24px quarter-shapes (Figma draws them as
   flipped/rotated rounded squares); the cell list below is the resolved
   corner set for each, so no transforms are needed. */

type Cell = { c: string; r: string };
/* order: top-left, top-right, bottom-left, bottom-right */
const GLYPHS: Cell[][] = [
  [
    { c: "var(--gf-yellow)", r: "15px 0 0 0" },
    { c: "var(--gf-purple)", r: "15px 0 0 0" },
    { c: "var(--dpc-sanal-lilac)", r: "15px" },
    { c: "var(--dpc-sanal-mauve)", r: "0 15px 0 0" },
  ],
  [
    { c: "var(--gf-yellow)", r: "0 0 15px 0" },
    { c: "var(--gf-purple)", r: "0 15px 0 0" },
    { c: "var(--dpc-sanal-mauve)", r: "0 15px 15px 0" },
    { c: "var(--dpc-sanal-lilac)", r: "15px" },
  ],
  [
    { c: "var(--dpc-sanal-lilac)", r: "15px" },
    { c: "var(--gf-purple)", r: "15px 15px 0 0" },
    { c: "var(--gf-yellow)", r: "0 15px 0 0" },
    { c: "var(--dpc-sanal-mauve)", r: "15px 0 0 0" },
  ],
];

export default function Sanal() {
  const S = DEBIT_SANAL;
  const uid = useId();
  return (
    <section className="dpc-section dpc-sanal" id={S.id} aria-labelledby={`${uid}-h`}>
      <div className="dpc-container">
        <SectionHead
          eyebrow={S.eyebrow}
          eyebrowClassName="dpc-sanal__eyebrow"
          title={S.title}
          sub={S.sub}
          titleId={`${uid}-h`}
          className="dpc-sanal__head"
        />

        <div className="dpc-sanal__stage">
          <div className="dpc-sanal__art" aria-hidden="true">
            {/* comp layer order: the rings sit over the hand */}
            <span className="dpc-sanal__hand">
              <img loading="lazy" src="/assets/img/hesap-karti/sanal-hand.webp" alt="" width={2250} height={1888} />
            </span>
            <span className="dpc-sanal__ring dpc-sanal__ring--3" />
            <span className="dpc-sanal__ring dpc-sanal__ring--2" />
            <span className="dpc-sanal__ring dpc-sanal__ring--1" />
          </div>

          <Reveal className="dpc-sanal__col" stagger={0.08}>
            <ul className="dpc-sanal__list">
              {S.features.map((f, i) => (
                <RevealItem as="li" key={f} className="dpc-sanal__card">
                  <span className="dpc-sanal__glyph" aria-hidden="true">
                    {GLYPHS[i % GLYPHS.length].map((cell, j) => (
                      <i key={j} style={{ background: cell.c, borderRadius: cell.r }} />
                    ))}
                  </span>
                  <p className="dpc-sanal__text">
                    {/* the comp breaks each benefit after its comma */}
                    {f.includes(", ") ? (
                      <>
                        {f.slice(0, f.indexOf(", ") + 1)}
                        <br /> {f.slice(f.indexOf(", ") + 2)}
                      </>
                    ) : (
                      f
                    )}
                  </p>
                </RevealItem>
              ))}
            </ul>
            <RevealItem>
              <a className="dpc-cta" href={S.href}>
                {S.cta}
              </a>
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
