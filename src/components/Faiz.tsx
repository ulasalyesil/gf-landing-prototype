"use client";

import React from "react";
import { motion } from "motion/react";
import Reveal, { RevealItem, iconPopVariants } from "./Reveal";
import AnimatedHighlight from "./AnimatedHighlight";

const FAIZ_POINTS = [
  {
    icon: "faiz.svg",
    text: (
      <>
        paranı bağlamadan
        <br />
        iyi faiz kazan
      </>
    ),
  },
  {
    icon: "sart-yok.svg",
    text: (
      <>
        kampanya yok,
        <br />
        hoş geldin yok
      </>
    ),
  },
  {
    icon: "ek-hesap.svg",
    text: (
      <>
        ek hesap açmana gerek yok,
        <br />
        hesabın günlük faizle kazansın
      </>
    ),
  },
];

export default function Faiz() {
  return (
    <section className="section faiz" id="faiz">
      <div className="container">
        <Reveal className="eyebrow-wrap">
          <h2 className="h-sec">
            yıllık %44 faizle{" "}
            <AnimatedHighlight type="mark">her gün kazan!</AnimatedHighlight>
          </h2>
          <p className="h-lead">kampanyaları ve avantajları kaçırma!</p>
        </Reveal>

        <Reveal className="faiz__phones" data-label="faiz-phones.png">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/assets/img/faiz-phones-mobile.png"
            />
            <img
              className="faiz-phones-img"
              src="/assets/img/faiz-phones.png"
              alt="faiz phones"
            />
          </picture>
        </Reveal>

        <Reveal className="faiz__points" stagger={0.06}>
          {FAIZ_POINTS.map((point, i) => (
            <RevealItem key={i} className="fpoint">
              <motion.span className="fpoint__ic" variants={iconPopVariants}>
                <img src={`/assets/icons/${point.icon}`} alt="" />
              </motion.span>
              <p>{point.text}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
