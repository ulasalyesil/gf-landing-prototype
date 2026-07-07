"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHighlight from "./AnimatedHighlight";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

export default function CampaignsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
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
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Entrance reveals
  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      ".reveal",
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
        onComplete: function(this: any) {
          const targets = this.targets();
          targets.forEach((t: HTMLElement) => t.classList.add("is-in"));
        }
      }
    );
  }, { scope: containerRef });

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

  // Helper to map card positional layout on desktop
  const getCardClasses = (idx: number) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 920;
    if (isMobile) {
      return idx === 1 ? "camp camp--feature" : "camp";
    }

    const rel = (idx - active + CAMPAIGNS.length) % CAMPAIGNS.length;
    if (rel === 0) return "camp camp-pos-center camp--feature";
    if (rel === 1) return "camp camp-pos-right";
    return "camp camp-pos-left";
  };

  return (
    <section
      className="section campaigns"
      id="avantajlar"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container">
        <div className="eyebrow-wrap">
          <h2 className="h-sec reveal">
            güncel getirfinans <AnimatedHighlight type="mark">fırsatları</AnimatedHighlight>
          </h2>
          <p className="h-lead reveal">kampanyaları ve avantajları kaçırma!</p>
        </div>

        <div
          className="campaigns__track reveal"
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

        <div className="campaigns__dots" id="campaignDots" aria-hidden="true">
          {CAMPAIGNS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={c.id === active ? "is-active" : ""}
              onClick={() => handleDotClick(c.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
