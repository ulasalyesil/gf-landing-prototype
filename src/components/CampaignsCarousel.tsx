"use client";

import React, { useState, useEffect, useRef } from "react";
import Reveal from "./Reveal";

const CAMPAIGNS = [
  {
    id: 0,
    img: "/assets/img/campaign-1.png",
    text: "fatura ödemene ₺500 toplamda ₺1.500 getirpara kazan!",
  },
  {
    id: 1,
    img: "/assets/img/campaign-2.png",
    text: "arkadaşını getir %0,99 faizli ₺20.000 kredi fırsatı kazan!",
  },
  {
    id: 2,
    img: "/assets/img/campaign-3.png",
    text: "getirmarket’te ₺750 indirim kazan!",
  },
];

const CYCLE_MS = 4000;

export default function CampaignsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1); // default featured middle card
  const [isHovered, setIsHovered] = useState(false);

  // Auto-swipe functionality
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % CAMPAIGNS.length;
        // On mobile, sync scroll position
        if (window.innerWidth <= 920 && trackRef.current) {
          const card = trackRef.current.children[next] as HTMLElement;
          trackRef.current.scrollTo({
            left: card.offsetLeft - trackRef.current.offsetLeft - 24,
            behavior: "smooth",
          });
        }
        return next;
      });
    }, CYCLE_MS);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Sync dots on mobile swipe
  const handleScroll = () => {
    if (!trackRef.current || window.innerWidth > 920) return;
    const track = trackRef.current;
    const center = track.scrollLeft + track.clientWidth / 2;
    let min = Infinity;
    let newActive = active;

    const cards = Array.from(track.children) as HTMLElement[];
    cards.forEach((c, idx) => {
      const cc = c.offsetLeft - track.offsetLeft + c.clientWidth / 2;
      const diff = Math.abs(cc - center);
      if (diff < min) {
        min = diff;
        newActive = idx;
      }
    });

    if (newActive !== active) {
      setActive(newActive);
    }
  };

  const handleDotClick = (idx: number) => {
    setActive(idx);
    if (window.innerWidth <= 920 && trackRef.current) {
      const card = trackRef.current.children[idx] as HTMLElement;
      trackRef.current.scrollTo({
        left: card.offsetLeft - trackRef.current.offsetLeft - 24,
        behavior: "smooth",
      });
    }
  };

  // Positions derive from state only (no window reads in render — SSR-safe,
  // fixes the hydration mismatch). The pos classes only apply ≥921px via CSS;
  // the featured card follows `active` on every viewport.
  const getCardClasses = (idx: number) => {
    const rel = (idx - active + CAMPAIGNS.length) % CAMPAIGNS.length;
    if (rel === 0) return "camp camp-pos-center camp--feature";
    if (rel === 1) return "camp camp-pos-right";
    return "camp camp-pos-left";
  };

  return (
    <section
      className="section campaigns"
      id="avantajlar"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container">
        <Reveal className="eyebrow-wrap">
          <h2 className="h-sec">
            güncel getirfinans fırsatları
          </h2>
          <p className="h-lead">kampanyaları ve avantajları kaçırma!</p>
        </Reveal>

        <Reveal direction="none">
          <div
            className="campaigns__track"
            id="campaignTrack"
            ref={trackRef}
            onScroll={handleScroll}
          >
            {CAMPAIGNS.map((c) => (
              <article key={c.id} className={getCardClasses(c.id)}>
                <div className="camp__img">
                  <img src={c.img} alt="" />
                </div>
                <div className="camp__body">
                  <span className="camp__arrow">
                    <img src="/assets/icons/arrow-right-circle.svg" alt="" />
                  </span>
                  <p className="camp__text">{c.text}</p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>

        <div
          className={`campaigns__dots ${isHovered ? "is-paused" : ""}`}
          id="campaignDots"
        >
          {CAMPAIGNS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={c.id === active ? "is-active" : ""}
              aria-label={`kampanya ${c.id + 1}`}
              onClick={() => handleDotClick(c.id)}
            >
              {/* progress fill — restarts whenever the active card or the
                  hover-pause state changes, so it stays in sync with the
                  auto-advance interval */}
              {c.id === active && (
                <span
                  key={`${active}:${isHovered}`}
                  className="campaigns__dot-fill"
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>

        <div className="campaigns__more-wrap">
          <a className="campaigns__more" href="#">
            daha fazlasını gör
            <img src="/assets/icons/chevron-right.svg" alt="" />
          </a>
        </div>
      </div>
    </section>
  );
}
