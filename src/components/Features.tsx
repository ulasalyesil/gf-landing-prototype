"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHighlight from "./AnimatedHighlight";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FEATURE_ITEMS = [
  {
    index: 0,
    title: "bizde kredin büyük",
    desc: "anında başvur, <b>%3,49</b>'dan başlayan faiz oranlarıyla kullan!",
    img: "/assets/img/neler-1.png",
  },
  {
    index: 1,
    title: "paran boş durmasın",
    desc: "günlük hesapta yıllık <b>%44</b> faizle her gün kazandırsın!",
    img: "/assets/img/neler-2.png",
  },
  {
    index: 2,
    title: "çarşıyı unutturan kurlar",
    desc: "altın, gümüş ve dövizde hafta içi akşamları bile dar makasla işlem yap!",
    img: "/assets/img/neler-3.png",
  },
  {
    index: 3,
    title: "geri dönüşü muhteşem kart",
    desc: "kartınla harcadıkça <b>%1</b> nakit iade ve getirpara kazan!",
    img: "/assets/img/neler-4.png",
  },
];

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Mobile media query check - bypass GSAP if mobile
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      const reveals = containerRef.current.querySelectorAll(".reveal");
      reveals.forEach((r) => r.classList.add("is-in"));
      return;
    }

    // Title reveal
    gsap.fromTo(
      ".reveal",
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features .sec-head",
          start: "top 82%",
          toggleActions: "play none none none",
        },
        onComplete: function(this: any) {
          const targets = this.targets();
          targets.forEach((t: HTMLElement) => t.classList.add("is-in"));
        }
      }
    );

    // Stagger cards
    const grid = containerRef.current.querySelector("[data-stagger]");
    if (grid) {
      gsap.fromTo(
        grid.children,
        { y: 24, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: grid,
            start: "top 82%",
          },
        }
      );
    }
  }, { scope: containerRef });

  return (
    <section className="section features" id="neler" ref={containerRef}>
      <div className="container">
        <header className="sec-head reveal">
          <h2 className="sec-title">
            parana iyi bakmanın <AnimatedHighlight type="hl">yolları</AnimatedHighlight>
          </h2>
          <p className="sec-lead">getirfinans’tan hep kazandıran bankacılık fırsatları</p>
        </header>

        <div className="features__grid" data-stagger>
          {FEATURE_ITEMS.map((item) => (
            <article
              key={item.index}
              className="feat"
              style={{ "--index": item.index } as React.CSSProperties}
            >
              <div className="feat__img media-slot ph" data-label={`neler-${item.index + 1}.png`}>
                <img src={item.img} alt={item.title} />
              </div>
              <div className="feat__text">
                <h3 className="feat__title">{item.title}</h3>
                <p
                  className="feat__desc"
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                />
              </div>
              <span className="feat__arrow" aria-hidden="true">
                <img src="/assets/icons/arrow-right-circle-thin.svg" alt="" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
