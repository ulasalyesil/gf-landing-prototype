"use client";

import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedHighlight from "@/components/AnimatedHighlight";
import "./debit-current.css";

export default function HesapKartiDetail() {
  // Add body class on mount, cleanup on unmount
  useEffect(() => {
    document.body.classList.add("dpc");
    return () => {
      document.body.classList.remove("dpc");
    };
  }, []);

  return (
    <>
      <Header />
      <main className="dpc">
        {/* ============ 1. HERO ============ */}
        <section className="dpc-hero">
          <div className="dpc-container h-full relative">
            <div className="dpc-hero__text">
              <span className="dpc-badge">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="w-5 h-5">
                  <path d="M11 2 4.5 11h4L9 18l6.5-9h-4L11 2z" fill="currentColor" />
                </svg>
                kartın dakikalar içinde kapında
              </span>
              <h1 className="dpc-hero__title">
                geri dönüşü
                <br />
                muhteşem kart
              </h1>
              <a href="#" className="dpc-cta dpc-hero__cta">
                kart al
              </a>
            </div>
            {/* Hero card video backdrop */}
            <div className="dpc-hero__card" aria-hidden="true">
              <video className="dpc-hero__video" autoPlay muted loop playsInline>
                <source src="/assets/video/debit-white-bg.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        {/* ============ 2. EARN ============ */}
        <section className="dpc-earn">
          <div className="dpc-container">
            <header className="dpc-earn__head">
              <h2 className="dpc-title">
                harcadıkça getirpara{" "}
                <AnimatedHighlight type="hl">ve nakit iade kazan</AnimatedHighlight>
              </h2>
              <p className="dpc-earn__sub">
                yemekten markete, akaryakıttan alışverişe nakit iade kazanırken;
                <br />
                getirmarket ve bitaksi’de getirpara ile kazancını katla
              </p>
            </header>
            <div className="dpc-earn__cards">
              <article className="dpc-earn__card dpc-earn__card--iade">
                <img src="/assets/img/debit-earn-photo.png" alt="" />
                <p>
                  fiziksel tüm harcamalarına aylık ₺1250'ye kadar anında nakit
                  iade!
                </p>
              </article>
              <article className="dpc-earn__card dpc-earn__card--getirpara">
                <img src="/assets/img/debit-earn-phone.png" alt="" />
                <p>
                  getirmarket ve bitaksi'de yapacağın harcamalara{" "}
                  <span className="y">%3</span> getirpara
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ============ 3. DELIVERY ============ */}
        <section className="dpc-steps">
          <div className="dpc-container h-full relative">
            <div className="dpc-steps__panel">
              <h2 className="dpc-title">
                hızlı kart <AnimatedHighlight type="hl">teslimatı</AnimatedHighlight>
              </h2>
              <p className="dpc-steps__panel-sub">kartın dakikalar içinde kapında</p>
              <a href="#" className="dpc-cta">
                kart al
              </a>
            </div>

            <ol className="dpc-steps__list">
              <li className="dpc-steps__item">
                <h3>Step 1</h3>
                <p>Open a free account in minutes</p>
              </li>
              <li className="dpc-steps__item">
                <h3>Step 2</h3>
                <p>Order a card for a one-time fee of 7 GBP</p>
              </li>
              <li className="dpc-steps__item">
                <h3>Step 3</h3>
                <p>Start spending with a digital card immediately</p>
              </li>
            </ol>
            <div className="dpc-steps__phone">
              <img src="/assets/img/debit-phone-tilted.png" alt="" />
            </div>
          </div>
        </section>

        {/* ============ 4. TRANSFERS ============ */}
        <section className="dpc-split">
          <div className="dpc-container h-full relative">
            <div
              className="dpc-split__media dpc-split__media--left"
              aria-hidden="true"
            >
              {/* Media placeholder */}
            </div>
            <div
              className="dpc-split__copy dpc-split__copy--right"
              style={{ top: "216px" }}
            >
              <h2 className="dpc-title">
                ücretsiz <AnimatedHighlight type="hl">para transferi</AnimatedHighlight>
              </h2>
              <p className="dpc-split__sub">7/24 ücretsiz havale, EFT, FAST</p>
            </div>
          </div>
        </section>

        {/* ============ 5. ATM ============ */}
        <section className="dpc-split">
          <div className="dpc-container h-full relative">
            <div
              className="dpc-split__copy dpc-split__copy--left"
              style={{ top: "200px" }}
            >
              <h2 className="dpc-title">
                anlaşmalı <AnimatedHighlight type="hl">5.355 ATM</AnimatedHighlight>
              </h2>
              <p className="dpc-split__sub">
                Fibabanka ve Akbank ATM'lerinden
                <br />
                ücretsiz para çek / yatır
              </p>
            </div>
            <div
              className="dpc-split__media dpc-split__media--right"
              aria-hidden="true"
            >
              placeholder image
            </div>
          </div>
        </section>

        {/* ============ 6. SANAL HESAP KARTI ============ */}
        <section className="dpc-split">
          <div className="dpc-container h-full relative">
            <div
              className="dpc-split__media dpc-split__media--left"
              aria-hidden="true"
            >
              sanal kart görseli
            </div>
            <div
              className="dpc-split__copy dpc-split__copy--right"
              style={{ top: "104px" }}
            >
              <h2 className="dpc-title">
                sanal <AnimatedHighlight type="hl">hesap kartı</AnimatedHighlight>
              </h2>
              <ul className="dpc-features">
                <li>harcamaların için ayrı kartlar oluştur, rahatça takip et</li>
                <li>internet alışverişlerini güvenle yap</li>
                <li>her kartın için limitini belirle, bütçeni kontrol et</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ============ 7. ABROAD ============ */}
        <section className="dpc-abroad">
          <div className="dpc-container">
            <h2 className="dpc-title dpc-abroad__title">
              hesap kartınla yurtdışında
              <br />
              <AnimatedHighlight type="hl">yapılacaklar listesi</AnimatedHighlight>
            </h2>
            <ul className="dpc-abroad__captions">
              <li>avantajlı kurlarla harcama yap</li>
              <li>yurt dışında harcarken de %1 nakit iade kazan</li>
              <li>ATM'den para çekerken komisyonu avantajlı kurla öde</li>
            </ul>
            <div className="dpc-abroad__collage">
              <img
                className="dpc-abroad__img-1"
                src="/assets/img/debit-abroad-1.png"
                alt=""
              />
              <img
                className="dpc-abroad__img-2"
                src="/assets/img/debit-abroad-2.png"
                alt=""
              />
              <img
                className="dpc-abroad__img-3"
                src="/assets/img/debit-abroad-3.png"
                alt=""
              />
              <img
                className="dpc-abroad__img-4"
                src="/assets/img/debit-abroad-4.png"
                alt=""
              />
              <img
                className="dpc-abroad__img-5"
                src="/assets/img/debit-abroad-5.png"
                alt=""
              />
              <img
                className="dpc-abroad__img-card"
                src="/assets/img/debit-card-render.png"
                alt=""
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
