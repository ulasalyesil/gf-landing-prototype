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

  function cardHTML(r) {
    const a = parts(r.price, r.dec);
    const up = r.dir >= 0;
    const trendCls = up ? "up" : "down";
    const trendIcon = up ? "trend-up.svg" : "trend-down.svg";
    return `
      <article class="rate-card" data-code="${r.code}">
        <div class="rate-card__info">
          <div class="rate-card__row">
            <span class="rate-card__flag"><img src="assets/icons/${FLAG_IMG[r.code] || ""}" alt="" onerror="this.remove()"></span>
            <span class="rate-card__crn">
              <b>${r.code}</b><small>${r.name}</small>
            </span>
            <span class="rate-card__trend ${trendCls}"><img src="assets/icons/${trendIcon}" alt=""> %${Math.abs(r.pct).toFixed(2).replace(".", ",")}</span>
          </div>
          <div class="rate-card__amount">
            <span class="cur">₺</span><span class="int">${a.int}</span><span class="dec">,${a.frac}</span>
          </div>
        </div>
        <div class="rate-card__legs">
          <button class="rate-leg"><span class="lbl">al</span><i class="div"></i><b>${full(r.al, r.dec)}</b></button>
          <button class="rate-leg"><span class="lbl">sat</span><i class="div"></i><b>${full(r.sat, r.dec)}</b></button>
        </div>
      </article>`;
  }

  function jitter(r) {
    const move = (Math.random() - 0.45) * r.price * 0.004;
    r.dir = move >= 0 ? 1 : -1;
    r.pct = (move / r.price) * 100;
    r.price = Math.max(0.0001, r.price + move);
    r.al = r.price + Math.abs(r.price * 0.0007);
    r.sat = r.price - Math.abs(r.price * 0.0006);
    return r;
  }

  function flash(code) {
    const el = document.querySelector(`.rate-card[data-code="${code}"] .rate-card__amount`);
    if (!el) return;
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 700);
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
