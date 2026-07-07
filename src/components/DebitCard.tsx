"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHighlight from "./AnimatedHighlight";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DebitCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const motoRef = useRef<HTMLImageElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  // ResizeObserver to measure moped travel distance
  useEffect(() => {
    if (!markRef.current || !motoRef.current) return;

    const measureTravel = () => {
      if (markRef.current && motoRef.current) {
        const markWidth = markRef.current.offsetWidth;
        motoRef.current.style.setProperty("--travel", `${markWidth + 28}px`);
      }
    };

    measureTravel();

    const observer = new ResizeObserver(() => measureTravel());
    observer.observe(markRef.current);

    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    if (!containerRef.current || !copyRef.current || !mediaRef.current) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      copyRef.current.classList.add("is-in");
      return;
    }

    // Scroll trigger for adding is-in class
    ScrollTrigger.create({
      trigger: copyRef.current,
      start: "top 82%",
      once: true,
      onEnter: () => {
        gsap.delayedCall(0.2, () => {
          if (copyRef.current) copyRef.current.classList.add("is-in");
        });
      },
    });

    // Float loop for debit card media
    gsap.to(mediaRef.current, {
      y: -12,
      duration: 2.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, { scope: containerRef });

  return (
    <section className="section debit" id="debit" ref={containerRef}>
      <div className="container debit__inner">
        <div className="debit__media media-slot reveal-left" ref={mediaRef}>
          <video autoPlay muted loop playsInline>
            <source src="/assets/video/debit-card.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="debit__copy reveal-right" ref={copyRef}>
          <h2 className="debit__title">
            geri dönüşü muhteşem kart
            <br />
            <span className="mark" ref={markRef}>
              hem de dakikalar içinde kapında!
              <img
                ref={motoRef}
                className="debit__moto"
                src="/assets/icons/courier.svg"
                alt="kurye"
              />
            </span>
          </h2>

          <ul className="debit__list">
            <li>
              <span className="debit__ic">
                <img src="/assets/icons/getirpara.svg" alt="" />
              </span>
              <div>
                <b>getir ve bitaksi’de %3 getirpara</b>
                <p>
                  hesap kartınla her ay toplam ₺1.250’ye kadar getirpara kazan
                </p>
              </div>
            </li>
            <li>
              <span className="debit__ic">
                <img src="/assets/icons/cashback.svg" alt="" />
              </span>
              <div>
                <b>anında %1 nakit iade</b>
                <p>
                  tüm fiziksel harcamalarda ₺1.250’ye kadar anında %1 nakit iade
                  kazan
                </p>
              </div>
            </li>
          </ul>

          <Link href="/hesap-karti" className="btn">
            <span className="ic">
              <img src="/assets/icons/arrow-right-circle.svg" alt="" />
            </span>
            keşfet
          </Link>
        </div>
      </div>
    </section>
  );
}
