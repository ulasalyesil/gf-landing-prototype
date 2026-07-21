"use client";

import React from "react";
import Reveal, { RevealItem } from "./Reveal";
import { NEWSLETTER } from "@/data/content";

/* Gazete promo — copy + CTA on the left, fanned page stack linking out on the
   right (side-by-side per owner feedback 2026-07-21; the pinned page-peel
   scrub was removed the same day). */

/* cover renders LAST in DOM (naturally on top, no z-index); the two pages
   behind it peek out as the fan */
const STACK_COUNT = 3;

export default function Newsletter() {
  const stack = NEWSLETTER.pages.slice(0, STACK_COUNT).reverse();

  return (
    <section
      className="section newsletter"
      id="newsletter"
      style={{ "--nl-page-ar": NEWSLETTER.pageAspect } as React.CSSProperties}
    >
      <div className="container newsletter__inner">
        <Reveal direction="left" className="newsletter__copy" stagger={0.08}>
          <RevealItem as="h2" className="newsletter__title">
            {NEWSLETTER.title}
            <br />
            {NEWSLETTER.titleHl}
          </RevealItem>
          <RevealItem as="p" className="newsletter__lead">
            {NEWSLETTER.lead}
          </RevealItem>
          <RevealItem as="p" className="newsletter__issue">
            {NEWSLETTER.issue.no} · {NEWSLETTER.issue.date}
          </RevealItem>
          <RevealItem>
            <a className="btn" href={NEWSLETTER.href}>
              <span className="ic">
                <img src="/assets/icons/arrow-right-circle.svg" alt="" />
              </span>
              {NEWSLETTER.cta}
            </a>
          </RevealItem>
        </Reveal>

        <Reveal direction="right" className="newsletter__media">
          <a
            className="newsletter__link"
            href={NEWSLETTER.href}
            aria-label="getirfinans gazetesi'ni oku"
          >
            <span className="newsletter__stack">
              {stack.map((page) => (
                <span key={page.src} className="newsletter__page">
                  <img
                    src={page.src}
                    alt={page.alt}
                    width={1191}
                    height={1684}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              ))}
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
