"use client";

import React from "react";
import Reveal, { RevealItem } from "./Reveal";
import { NEWSLETTER } from "@/data/content";

/* Gazete promo — static fanned stack that links out to the newsletter.
   (Replaced the pinned page-peel scrub per owner feedback, 2026-07-21.) */

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
      <div className="container">
        <Reveal className="eyebrow-wrap newsletter__head">
          <h2 className="h-sec">
            {NEWSLETTER.title} {NEWSLETTER.titleHl}
          </h2>
          <p className="h-lead">{NEWSLETTER.lead}</p>
        </Reveal>

        <Reveal className="newsletter__stage" stagger={0.08}>
          <RevealItem>
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
      </div>
    </section>
  );
}
