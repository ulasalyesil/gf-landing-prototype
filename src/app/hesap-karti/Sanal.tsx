/* Created by Claude · INTERNAL */
"use client";

import { useId } from "react";
import SectionHead from "@/components/SectionHead";
import Reveal, { RevealItem } from "@/components/Reveal";
import { useStory } from "@/components/useStory";
import SanalShader from "./SanalShader";
import { DEBIT_SANAL } from "@/data/content";

/* "sanal hesap kartıyla güvenle harca" — Web comp 294:40254 (2026-10-14).

   A dark violet band: centred head with its CTA, three outlined feature
   cards, and the fanned virtual cards rising out of the foot (one photo,
   turned −15° as in the comp, clipped by the section). The fan is placed
   from the section's centre and foot in comp px × `--u`, so it holds its
   relation to the feature row as the page narrows.

   Background: a light WebGL shader (`SanalShader`) in place of the
   comp's exported gradient (owner, 2026-10-16).

   Each feature glyph acts out its line (useStory: once in view, again on
   a hover over its card; ≤767 / reduced motion = the comp, still):
   - cards  — two ghost cards fan out of the card and fold back in
   - limit  — the cog drops onto the cards and turns into place
   - secure — the card slides in, its dots type out, the check stamps on

   Replaces the pale-yellow version (frosted cards over the hand-held card,
   2026-09); that file is in git history at 65e11be. */

const A = "/assets/img/hesap-karti";
const POP = { type: "spring", duration: 0.55, bounce: 0.45 } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

function CardsGlyph() {
  return (
    <span className="dbc-sn__glyph dbc-sn__glyph--cards">
      <span className="dbc-sn__g-rot">
        <img className="dbc-sn__ghost dbc-sn__ghost--a" src={`${A}/sanal-ico-cards.svg`} alt="" loading="lazy" />
        <img className="dbc-sn__ghost dbc-sn__ghost--b" src={`${A}/sanal-ico-cards.svg`} alt="" loading="lazy" />
        <img className="dbc-sn__main" src={`${A}/sanal-ico-cards.svg`} alt="" loading="lazy" />
      </span>
    </span>
  );
}

function LimitGlyph() {
  return (
    <span className="dbc-sn__glyph dbc-sn__glyph--limit">
      <span className="dbc-sn__g-rot">
        <img className="dbc-sn__main" src={`${A}/sanal-ico-limit-base.svg`} alt="" loading="lazy" />
        {/* same viewBox as the base, so it overlays exactly; turns on its own hub */}
        <img className="dbc-sn__gear" src={`${A}/sanal-ico-limit-gear.svg`} alt="" loading="lazy" />
      </span>
    </span>
  );
}

function SecureGlyph() {
  return (
    <span className="dbc-sn__glyph dbc-sn__glyph--secure">
      <span className="dbc-sn__g-back" />
      <span className="dbc-sn__g-front" />
      <span className="dbc-sn__g-sheen" />
      <img className="dbc-sn__g-dots" src={`${A}/sanal-ico-dots.svg`} alt="" width={20.7867} height={6.92912} loading="lazy" />
      <img className="dbc-sn__g-check" src={`${A}/sanal-ico-check.svg`} alt="" width={55.4314} height={55.4314} loading="lazy" />
    </span>
  );
}

/* stories: every property is [from, …, rest]; rest = the comp */
const STORIES = {
  cards: [
    [".dbc-sn__main", { scale: [0.82, 1] }, { ...POP }],
    [".dbc-sn__ghost--a", { opacity: [0, 0.6, 0.6, 0], rotate: [0, -16, -16, 0], x: [0, -4, -4, 0] }, { duration: 1.3, times: [0, 0.3, 0.65, 1], ease: EASE, at: 0.1 }],
    [".dbc-sn__ghost--b", { opacity: [0, 0.6, 0.6, 0], rotate: [0, 16, 16, 0], x: [0, 4, 4, 0] }, { duration: 1.3, times: [0, 0.3, 0.65, 1], ease: EASE, at: 0.18 }],
  ],
  limit: [
    [".dbc-sn__main", { scale: [0.88, 1], opacity: [0, 1] }, { ...POP }],
    [".dbc-sn__gear", { scale: [0, 1.12, 1], rotate: [-200, 0] }, { scale: { duration: 0.5, times: [0, 0.7, 1], ease: "easeOut" }, rotate: { duration: 1.1, ease: EASE }, at: 0.15 }],
  ],
  secure: [
    [".dbc-sn__g-back", { x: [-14, 0], opacity: [0, 1] }, { duration: 0.5, ease: EASE }],
    [".dbc-sn__g-front, .dbc-sn__g-sheen", { x: [-10, 0], opacity: [0, 1] }, { duration: 0.5, ease: EASE, at: 0.08 }],
    [".dbc-sn__g-dots", { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] }, { duration: 0.45, ease: "linear", at: 0.35 }],
    [".dbc-sn__g-check", { scale: [0, 1], rotate: [-35, 0] }, { ...POP, at: 0.7 }],
  ],
} as const;

const GLYPHS: Record<string, () => React.ReactNode> = {
  cards: CardsGlyph,
  limit: LimitGlyph,
  secure: SecureGlyph,
};

function Feature({ icon, text, br, em, index }: { icon: string; text: string; br?: boolean; em: string; index: number }) {
  const Glyph = GLYPHS[icon];
  const story = STORIES[icon as keyof typeof STORIES];
  // the three cards play left to right as the row enters
  const scope = useStory<HTMLLIElement>(story as never, { delay: 0.35 + index * 0.18, amount: 0.6, hoverTarget: "self" });
  return (
    <RevealItem as="li" className="dbc-sanal__feature" ref={scope as React.Ref<HTMLElement>}>
      <span className="dbc-sn__icon" aria-hidden="true">
        <Glyph />
      </span>
      <p className="dbc-sanal__text">
        {/* the space survives where the break is hidden (≤767) */}
        {text}{" "}
        {br && <br />}
        <b>{em}</b>
      </p>
    </RevealItem>
  );
}

export default function Sanal() {
  const S = DEBIT_SANAL;
  const uid = useId();
  return (
    <section className="dbc-sanal" id={S.id} aria-labelledby={`${uid}-h`}>
      <SanalShader />
      <div className="dpc-container dbc-sanal__inner">
        <SectionHead eyebrow={S.eyebrow} title={S.title} sub={S.sub} titleId={`${uid}-h`} className="dbc-sanal__head" />
        <Reveal className="dbc-sanal__cta" delay={0.15}>
          <RevealItem>
            <a className="dpc-cta" href={S.href}>
              {S.cta}
            </a>
          </RevealItem>
        </Reveal>
        <Reveal as="ul" className="dbc-sanal__features" stagger={0.08}>
          {S.features.map((f, i) => (
            <Feature key={f.icon} icon={f.icon} text={f.text} br={f.br} em={f.em} index={i} />
          ))}
        </Reveal>
      </div>
      <div className="dbc-sanal__fan" aria-hidden="true">
        <img src={`${A}/sanal-cards.webp`} alt="" width={1208} height={673} loading="lazy" />
      </div>
    </section>
  );
}
