/* Rates: render FX cards + simulated 3-min refresh with tick flash.
   Card layout matches Figma node 21184:6194. Swap initRates internals for a
   real fetch later — same render contract. */
(function () {
  // Real flag / coin SVGs (assets/icons) keyed by code; rendered inside the 32px circle.
  const FLAG_IMG = { USD: "flag-usd.svg", EUR: "flag-eur.svg", XAU: "coin-gold.svg", XAG: "coin-silver.svg" };

  const fmtTime = (d) => d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  function parts(n, dec) {
    const [int, frac] = n.toFixed(dec).split(".");
    return { int: int.replace(/\B(?=(\d{3})+(?!\d))/g, "."), frac: frac || "" };
  }
  function full(n, dec) { const p = parts(n, dec); return p.frac ? `${p.int},${p.frac}` : p.int; }

  function legHTML(label, value, dec) {
    const p = parts(value, dec);
    return `
          <button class="rate-leg" aria-label="${label} ${full(value, dec)}">
            <span class="rate-leg__lbl">${label}</span>
            <span class="rate-leg__val"><span class="int">${p.int}</span><span class="dec">,${p.frac}</span></span>
          </button>`;
  }

  function cardHTML(r) {
    const up = r.dir >= 0;
    const trendCls = up ? "up" : "down";
    const trendIcon = up ? "trend-up.svg" : "trend-down.svg";
    return `
      <article class="rate-card" data-code="${r.code}">
        <div class="rate-card__row">
          <span class="rate-card__flag"><img src="assets/icons/${FLAG_IMG[r.code] || ""}" alt="" onerror="this.remove()"></span>
          <span class="rate-card__crn">
            <b>${r.code}</b><small>${r.name}</small>
          </span>
          <span class="rate-card__trend ${trendCls}"><img src="assets/icons/${trendIcon}" alt=""> %${Math.abs(r.pct).toFixed(2).replace(".", ",")}</span>
        </div>
        <div class="rate-card__legs">
          ${legHTML("al", r.al, r.dec)}
          ${legHTML("sat", r.sat, r.dec)}
        </div>
      </article>`;
  }

  function jitter(r) {
    const move = (Math.random() - 0.45) * r.price * 0.004;
    r.dir = move >= 0 ? 1 : -1;
    r.pct = (move / r.price) * 100;
    r.price = Math.max(0.0001, r.price + move);
    r.al = r.price * 1.0065;
    r.sat = r.price * 0.9935;
    return r;
  }

  function flash(code) {
    const els = document.querySelectorAll(`.rate-card[data-code="${code}"] .rate-leg`);
    els.forEach((el) => {
      el.classList.add("flash");
      setTimeout(() => el.classList.remove("flash"), 700);
    });
  }

  window.initRates = function () {
    const mount = document.getElementById("ratesCards");
    const timeEl = document.querySelector("[data-rates-time]");
    if (!mount) return;
    const data = window.RATES_SEED.map((r) => ({ ...r, dir: 1, pct: 1.86 }));

    const render = () => { mount.innerHTML = data.map(cardHTML).join(""); };
    const setTime = () => { if (timeEl) timeEl.textContent = fmtTime(new Date()); };
    render(); setTime();

    setInterval(() => {
      data.forEach(jitter); render(); setTime();
      data.forEach((r) => flash(r.code));
    }, window.RATES_CYCLE_MS || 180000);
  };
})();
