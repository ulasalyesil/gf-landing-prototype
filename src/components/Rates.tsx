"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RATES_SEED, RATES_CYCLE_MS, RateItem } from "@/data/content";
import AnimatedHighlight from "./AnimatedHighlight";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FLAG_IMG: Record<string, string> = {
  USD: "flag-usd.svg",
  EUR: "flag-eur.svg",
  XAU: "coin-gold.svg",
  XAG: "coin-silver.svg",
};

export default function Rates() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rates, setRates] = useState<RateItem[]>([]);
  const [updateTime, setUpdateTime] = useState("--:--");
  const [isAnimating, setIsAnimating] = useState(false);
  const [flashCard, setFlashCard] = useState<string | null>(null);

  // Initialize data and cycle
  useEffect(() => {
    const data = RATES_SEED.map((r) => ({ ...r, dir: 1, pct: 1.86 }));
    setRates(data);

    const fmtTime = (d: Date) =>
      d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    setUpdateTime(fmtTime(new Date()));

    const interval = setInterval(() => {
      // Jitter rates
      setRates((prevRates) =>
        prevRates.map((r) => {
          const move = (Math.random() - 0.45) * r.price * 0.004;
          const dir = move >= 0 ? 1 : -1;
          const pct = (move / r.price) * 100;
          const price = Math.max(0.0001, r.price + move);
          return {
            ...r,
            dir,
            pct,
            price,
            al: price * 1.0065,
            sat: price * 0.9935,
          };
        })
      );
      
      // Flash legs and play animation
      setFlashCard("all");
      setIsAnimating(true);
      setUpdateTime(fmtTime(new Date()));

      // Reset animation states
      setTimeout(() => {
        setIsAnimating(false);
        setFlashCard(null);
      }, 1000);
    }, RATES_CYCLE_MS);

    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Head reveal
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
          trigger: ".rates",
          start: "top 82%",
          toggleActions: "play none none none",
        },
        onComplete: function(this: any) {
          // Add is-in class to completed reveals
          const targets = this.targets();
          targets.forEach((t: HTMLElement) => t.classList.add("is-in"));
        }
      }
    );

    // Stagger cards reveal inside rates cards wrapper
    const cardsWrapper = containerRef.current.querySelector("[data-stagger]");
    if (cardsWrapper) {
      gsap.fromTo(
        cardsWrapper.children,
        { y: 24, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: cardsWrapper,
            start: "top 82%",
          },
        }
      );
    }
  }, { scope: containerRef });

  // Formatting helpers
  const splitParts = (n: number, dec: number) => {
    const [int, frac] = n.toFixed(dec).split(".");
    return {
      int: int.replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      frac: frac || "",
    };
  };

  const fullFmt = (n: number, dec: number) => {
    const p = splitParts(n, dec);
    return p.frac ? `${p.int},${p.frac}` : p.int;
  };

  const renderDigits = (val: string, isEnd = false) => {
    const chars = val.split("");
    return chars.map((ch, i) => {
      if (isEnd) {
        const fromEnd = chars.length - 1 - i;
        const popVal = fromEnd === 1 ? 1 : fromEnd === 0 ? 2 : undefined;
        return (
          <span key={i} className="t-digit" data-pop={popVal}>
            {ch}
          </span>
        );
      }
      return (
        <span key={i} className="t-digit">
          {ch}
        </span>
      );
    });
  };

  return (
    <section className="section rates" id="rates" ref={containerRef}>
      <div className="container">
        <header className="sec-head reveal">
          <h2 className="sec-title">
            güncel <AnimatedHighlight type="hl">kurlar</AnimatedHighlight>
          </h2>
          <p className="rates__updated sec-lead">
            son güncelleme saati <b>{updateTime}</b>
          </p>
        </header>

        <div className="rates__row reveal">
          <div className="rates__cards" id="ratesCards" data-stagger>
            {rates.map((r) => {
              const up = (r.dir ?? 1) >= 0;
              const trendIcon = up ? "trend-up.svg" : "trend-down.svg";
              const isFlashing = flashCard === "all" || flashCard === r.code;

              const buyParts = splitParts(r.al, r.dec);
              const sellParts = splitParts(r.sat, r.dec);

              return (
                <article key={r.code} className="rate-card" data-code={r.code}>
                  <div className="rate-card__row">
                    <span className="rate-card__flag">
                      <img
                        src={`/assets/icons/${FLAG_IMG[r.code] || ""}`}
                        alt=""
                      />
                    </span>
                    <span className="rate-card__crn">
                      <b>{r.code}</b>
                      <small>{r.name}</small>
                    </span>
                    <span
                      className={`rate-card__trend ${
                        up ? "up" : "down"
                      } inline-flex items-center gap-[2px]`}
                    >
                      <img src={`/assets/icons/${trendIcon}`} alt="" /> %
                      {Math.abs(r.pct ?? 1.86)
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                  </div>

                  <div className="rate-card__legs">
                    <button
                      className={`rate-leg ${isFlashing ? "flash" : ""}`}
                      aria-label={`al ${fullFmt(r.al, r.dec)}`}
                    >
                      <span className="rate-leg__lbl">al</span>
                      <span
                        className={`rate-leg__val t-digit-group ${
                          isAnimating ? "is-animating" : ""
                        }`}
                      >
                        <span className="int">
                          {renderDigits(buyParts.int)}
                        </span>
                        <span className="dec">
                          {renderDigits("," + buyParts.frac, true)}
                        </span>
                      </span>
                    </button>

                    <button
                      className={`rate-leg ${isFlashing ? "flash" : ""}`}
                      aria-label={`sat ${fullFmt(r.sat, r.dec)}`}
                    >
                      <span className="rate-leg__lbl">sat</span>
                      <span
                        className={`rate-leg__val t-digit-group ${
                          isAnimating ? "is-animating" : ""
                        }`}
                      >
                        <span className="int">
                          {renderDigits(sellParts.int)}
                        </span>
                        <span className="dec">
                          {renderDigits("," + sellParts.frac, true)}
                        </span>
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <a href="#" className="rates__more">
            <span>tüm güncel kurları gör</span>
            <span className="rates__more-ic">
              <img src="/assets/icons/chevron-right.svg" alt="" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
