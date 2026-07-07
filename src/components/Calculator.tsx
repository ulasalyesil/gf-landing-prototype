"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Calculator() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // States
  const [activeTab, setActiveTab] = useState<"gunluk" | "vadeli">("gunluk");
  const [currency, setCurrency] = useState<"TRY" | "USD" | "EUR">("TRY");
  const [amount, setAmount] = useState("160.000");
  const [days, setDays] = useState("32");
  
  const [netGain, setNetGain] = useState(12000);
  const [totalBalance, setTotalBalance] = useState(172000);
  const [principal, setPrincipal] = useState(160000);
  const [dueDate, setDueDate] = useState("11.07.2025");
  
  const [calcState, setCalcState] = useState<"idle" | "done" | "drawing">("idle");

  // Indicator sliding measurements
  const [tabStyle, setTabStyle] = useState<React.CSSProperties>({});
  const [pillStyle, setPillStyle] = useState<React.CSSProperties>({});

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const curRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Slide indicators on tab/currency changes
  useEffect(() => {
    const activeTabEl = tabRefs.current[activeTab];
    if (activeTabEl) {
      setTabStyle({
        transform: `translateX(${activeTabEl.offsetLeft}px)`,
        width: `${activeTabEl.offsetWidth}px`,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const activeCurEl = curRefs.current[currency];
    if (activeCurEl) {
      setPillStyle({
        transform: `translateX(${activeCurEl.offsetLeft}px)`,
        width: `${activeCurEl.offsetWidth}px`,
      });
    }
  }, [currency]);

  // Recalculate default date on mount
  useEffect(() => {
    calculateResults(false);
  }, []);

  // Entrance reveals
  useGSAP(() => {
    if (!containerRef.current) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      const reveals = containerRef.current.querySelectorAll(".reveal");
      reveals.forEach((r) => r.classList.add("is-in"));
      return;
    }

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) {
      setAmount("");
      return;
    }
    setAmount(parseInt(val, 10).toLocaleString("tr-TR"));
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setDays(val);
  };

  const calculateResults = (triggerAnim = true) => {
    const a = parseFloat(amount.replace(/\./g, "")) || 0;
    const d = parseInt(days, 10) || 0;
    
    // Custom calculation formulas from prototype
    const gross = (a * 44) / 100 * (d / 365);
    const net = gross * 0.925; // 7.5% stopaj kesintisi mock

    setNetGain(net);
    setTotalBalance(a + net);
    setPrincipal(a);

    const date = new Date();
    date.setDate(date.getDate() + d);
    setDueDate(date.toLocaleDateString("tr-TR"));

    if (triggerAnim) {
      setCalcState("drawing");
      setTimeout(() => {
        setCalcState("done");
      }, 500);

      // Reset state after 2 seconds
      setTimeout(() => {
        setCalcState("idle");
      }, 2000);
    }
  };

  const tlFormat = (val: number) => {
    const sign = currency === "USD" ? "$" : currency === "EUR" ? "€" : "₺";
    return `${sign} ${Math.floor(val).toLocaleString("tr-TR")}`;
  };

  return (
    <section className="section calc" id="calc" ref={containerRef}>
      <div className="container">
        {/* Tabs Control */}
        <div className="calc__tabs reveal">
          <span
            className="calc__tabs-underline"
            style={tabStyle}
            aria-hidden="true"
          />
          <button
            ref={(el) => { tabRefs.current["gunluk"] = el; }}
            className={clsx("calc__tab", activeTab === "gunluk" && "is-active")}
            type="button"
            onClick={() => setActiveTab("gunluk")}
          >
            <b>günlük</b>
            <span>her gün kazan</span>
          </button>
          <button
            ref={(el) => { tabRefs.current["vadeli"] = el; }}
            className={clsx("calc__tab", activeTab === "vadeli" && "is-active")}
            type="button"
            onClick={() => setActiveTab("vadeli")}
          >
            <b>vadeli</b>
            <span>iyi faizi vadeyle sabitle</span>
          </button>
        </div>

        {/* Container box */}
        <div className="calc__container reveal">
          <div className="calc-card">
            <div className="calc-card__top">
              {/* Currency Control */}
              <div className="calc-currency">
                <span
                  className="calc-currency__pill"
                  style={pillStyle}
                  aria-hidden="true"
                />
                {(["TRY", "USD", "EUR"] as const).map((cur) => (
                  <button
                    key={cur}
                    ref={(el) => { curRefs.current[cur] = el; }}
                    className={clsx(
                      "calc-currency__btn",
                      currency === cur && "is-active"
                    )}
                    type="button"
                    onClick={() => setCurrency(cur)}
                  >
                    {cur === "TRY" ? "TL" : cur}
                  </button>
                ))}
              </div>
              <div className="calc-badge">%44,00 faiz</div>
            </div>

            <div className="calc-inputs">
              <div className="calc-field">
                <label htmlFor="calcAmount">mevduat tutarı</label>
                <input
                  type="text"
                  id="calcAmount"
                  className="calc-input"
                  value={amount}
                  onChange={handleAmountChange}
                  inputMode="numeric"
                />
              </div>
              <div className="calc-field-row">
                <div className="calc-field">
                  <label htmlFor="calcDays">vade</label>
                  <input
                    type="text"
                    id="calcDays"
                    className="calc-input"
                    value={days}
                    onChange={handleDaysChange}
                    inputMode="numeric"
                  />
                </div>
                <div className="calc-field calc-field--unit">
                  <span>gün</span>
                </div>
              </div>
            </div>

            <button
              className={clsx("btn calc-btn", calcState !== "idle" && "is-done")}
              id="calcBtn"
              type="button"
              onClick={() => calculateResults(true)}
              style={calcState !== "idle" ? { background: "var(--color-gf-up)" } : undefined}
            >
              <span
                className="calc-btn__check t-success-check"
                data-state={calcState === "drawing" || calcState === "done" ? "in" : "out"}
                aria-hidden="true"
              >
                <svg viewBox="0 0 48 48" fill="none" className="w-5 h-5">
                  <path
                    d="M13 24l7 7 15-16"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="calc-btn__label">
                {calcState !== "idle" ? "hesaplandı" : "hesapla"}
              </span>
            </button>

            <div className="calc-info">
              <span className="calc-info-ic">i</span>
              <p>
                hesap makinesi, faizin ertesi gün hesaba geçtiğini varsayarak faiz
                getirisi eklenmiş bakiye üzerinden hesaplama yapar. günlük
                hesapta ise hafta sonu ve resmi tatillerde basit faiz uygulanır;
                bu nedenle, hesap makinesi ile hesabına yansıyan tutar arasında
                fark oluşabilir
              </p>
            </div>
          </div>

          <div className="calc-results">
            <div className="calc-res">
              <span>
                net kazancın{" "}
                <span className="t-tt-wrap">
                  <i
                    className="calc-res__i t-tt-trigger"
                    tabIndex={0}
                    role="button"
                    aria-describedby="ttNet"
                  >
                    i
                  </i>
                  <span className="t-tt" id="ttNet" role="tooltip">
                    stopaj (%7,5) kesintisi sonrası elinize geçen net faiz
                    getirisi
                  </span>
                </span>
              </span>
              <b id="resNet">{tlFormat(netGain)}</b>
            </div>
            <div className="calc-res">
              <span>vade sonu bakiyen</span>
              <b id="resTotal">{tlFormat(totalBalance)}</b>
            </div>
            <div className="calc-res">
              <span>alt limit tutarı</span>
              <b id="resDate">{dueDate}</b>
            </div>
            <div className="calc-res">
              <span>faiz işletilen tutar</span>
              <b id="resPrincipal">{tlFormat(principal)}</b>
            </div>
          </div>

          <button type="button" className="calc-rates-row">
            <span>oranlar ve limitler</span>
            <span className="calc-rates-row__ic">
              <img src="/assets/icons/chevron-right.svg" alt="" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
