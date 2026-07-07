"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHighlight from "./AnimatedHighlight";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Transfer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !stageRef.current) return;

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

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) return;

    // Fly in animation trigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stageRef.current,
        start: "top 72%",
      },
    });

    tl.fromTo(
      ".transfer__phone",
      { y: 60, opacity: 0, scale: 0.94 },
      { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }
    )
      .fromTo(
        ".transfer__card--left",
        { xPercent: -50, yPercent: -30, x: 0, rotate: 0, opacity: 0 },
        { x: -185, rotate: -11, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=.45"
      )
      .fromTo(
        ".transfer__card--right",
        { xPercent: -50, yPercent: -30, x: 0, rotate: 0, opacity: 0 },
        { x: 185, rotate: 11, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=.7"
      );

    // Hover listeners
    const handleMouseEnter = () => {
      gsap.to(".transfer__card--left", {
        x: -240,
        rotate: 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(".transfer__card--right", {
        x: 240,
        rotate: 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(".transfer__card--left", {
        x: -185,
        rotate: -11,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(".transfer__card--right", {
        x: 185,
        rotate: 11,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const stageEl = stageRef.current;
    stageEl.addEventListener("mouseenter", handleMouseEnter);
    stageEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      stageEl.removeEventListener("mouseenter", handleMouseEnter);
      stageEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { scope: containerRef });

  return (
    <section className="section transfer" id="transfer" ref={containerRef}>
      <div className="transfer__rings hide-on-mobile" aria-hidden="true"></div>
      <div className="container">
        <div className="eyebrow-wrap">
          <h2 className="h-sec reveal">
            para transferi tabii ki{" "}
            <AnimatedHighlight type="mark">ücretsiz!</AnimatedHighlight>
          </h2>
          <p className="h-lead reveal">
            para gönderirken ücret düşünme. 7/24 ücretsiz EFT, FAST ve havale
            yap.
            <br />
            getirfinanslılar arasında döviz ve değerli maden transferleri de
            ücretsiz
          </p>
        </div>

        <div className="transfer__stage" ref={stageRef}>
          <div className="transfer__card transfer__card--left media-slot">
            <img src="/assets/img/transfer-card-left.png" alt="" />
          </div>
          <div className="transfer__phone media-slot">
            <img src="/assets/img/transfer-phone.png" alt="" />
          </div>
          <div className="transfer__card transfer__card--right media-slot">
            <img src="/assets/img/transfer-card-right.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
