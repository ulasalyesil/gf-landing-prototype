"use client";

import React from "react";
import Reveal, { RevealItem } from "./Reveal";
import AnimatedHighlight from "./AnimatedHighlight";

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
  return (
    <section className="section features" id="neler">
      <div className="container">
        <Reveal as="header" className="sec-head">
          <h2 className="sec-title">
            parana iyi bakmanın <AnimatedHighlight type="hl">yolları</AnimatedHighlight>
          </h2>
          <p className="sec-lead">getirfinans’tan hep kazandıran bankacılık fırsatları</p>
        </Reveal>

        <Reveal className="features__grid" stagger={0.06}>
          {FEATURE_ITEMS.map((item) => (
            <RevealItem
              key={item.index}
              as="article"
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
                <img
                  className="feat__arrow-fill"
                  src="/assets/icons/arrow-right-circle.svg"
                  alt=""
                />
              </span>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
