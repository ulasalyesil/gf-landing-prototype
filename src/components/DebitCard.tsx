"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Reveal, { RevealItem, iconPopVariants, useMotionOff } from "./Reveal";

export default function DebitCard() {
  const markRef = useRef<HTMLSpanElement>(null);
  const motoRef = useRef<HTMLImageElement>(null);
  const off = useMotionOff();

  // ResizeObserver to measure moped travel distance
  useEffect(() => {
    if (!markRef.current || !motoRef.current) return;

    const measureTravel = () => {
      if (markRef.current && motoRef.current) {
        const markWidth = markRef.current.offsetWidth;
        motoRef.current.style.setProperty("--travel", `${markWidth + 34}px`);
      }
    };

    measureTravel();

    const observer = new ResizeObserver(() => measureTravel());
    observer.observe(markRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section debit" id="debit">
      <div className="container debit__inner">
        <Reveal direction="left" className="debit__media-wrap">
          <motion.div
            className="debit__media media-slot"
            animate={off ? undefined : { y: [0, -12, 0] }}
            transition={
              off
                ? undefined
                : { duration: 5.2, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <video autoPlay muted loop playsInline>
              <source src="/assets/video/debit-card.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </Reveal>

        <Reveal direction="right" className="debit__copy" stagger={0.08} delay={0.2}>
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
            <RevealItem as="li">
              <motion.span className="debit__ic" variants={iconPopVariants}>
                <img src="/assets/icons/getirpara.svg" alt="" />
              </motion.span>
              <div>
                <b>getir ve bitaksi’de %3 getirpara</b>
                <p>
                  hesap kartınla her ay toplam ₺1.250’ye kadar getirpara kazan
                </p>
              </div>
            </RevealItem>
            <RevealItem as="li">
              <motion.span className="debit__ic" variants={iconPopVariants}>
                <img src="/assets/icons/cashback.svg" alt="" />
              </motion.span>
              <div>
                <b>anında %1 nakit iade</b>
                <p>
                  tüm fiziksel harcamalarda ₺1.250’ye kadar anında %1 nakit iade
                  kazan
                </p>
              </div>
            </RevealItem>
          </ul>

          <Link href="/hesap-karti" className="btn">
            <span className="ic">
              <img src="/assets/icons/arrow-right-circle.svg" alt="" />
            </span>
            keşfet
          </Link>

          {/* delivery-time disclaimer for the "dakikalar içinde kapında" claim */}
          <RevealItem as="p" className="debit__legal">
            teslimat süresi lokasyona ve operasyonel koşullara göre değişiklik
            gösterebilir
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
