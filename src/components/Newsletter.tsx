"use client";

import React from "react";
import Reveal, { RevealItem } from "./Reveal";
import { NEWSLETTER } from "@/data/content";

/* Gazete promo — copy + CTA on the left, marketing's flat newspaper render
   linking out on the right (side-by-side per owner feedback 2026-07-21; the
   fanned page stack was replaced by the marketing static image 2026-07-22). */

export default function Newsletter() {
  return (
    <section
      className="section newsletter"
      id="newsletter"
      style={{ "--nl-image-ar": NEWSLETTER.imageAspect } as React.CSSProperties}
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
            <img
              src={NEWSLETTER.image.src}
              alt={NEWSLETTER.image.alt}
              width={1122}
              height={1036}
              loading="lazy"
              decoding="async"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
