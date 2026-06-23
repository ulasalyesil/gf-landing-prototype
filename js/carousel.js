/* Hero title swap, hero badge swap, campaign auto-swipe carousel */
(function () {
  // ---- Hero offer flip: title + sub cross-fade together through HERO_OFFERS ----
  window.initHeroOffers = function () {
    const titleEl = document.querySelector(".hero__title-swap");
    const subEl = document.getElementById("heroSub");
    if (!titleEl || !subEl || !window.HERO_OFFERS || window.HERO_OFFERS.length < 2) return;
    const offers = window.HERO_OFFERS;
    const els = [titleEl, subEl];
    const paint = (o) => { titleEl.textContent = o.title; subEl.innerHTML = o.sub; };
    paint(offers[0]);
    let i = 0;
    setInterval(() => {
      i = (i + 1) % offers.length;
      els.forEach((el) => {
        el.style.transition = "opacity .4s ease, transform .4s ease";
        el.style.opacity = "0";
        el.style.transform = "translateY(-10px)";
      });
      setTimeout(() => {
        paint(offers[i]);
        els.forEach((el) => { el.style.transform = "translateY(10px)"; });
        requestAnimationFrame(() => {
          els.forEach((el) => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; });
        });
      }, 400);
    }, 4000);
  };

  // ---- Campaigns (auto-swipe + indicators) ----
  // Desktop: the active card is the featured (tall, centered) one; it auto-advances
  // every few seconds, reordering so the active card sits in the middle slot.
  // Mobile (<=920px): native scroll-snap; dots sync to the scrolled card.
  window.initCampaigns = function () {
    const track = document.getElementById("campaignTrack");
    const dotsWrap = document.getElementById("campaignDots");
    if (!track) return;
    const cards = [...track.children];
    const n = cards.length;
    const mq = window.matchMedia("(max-width: 920px)");

    cards.forEach(() => dotsWrap.appendChild(document.createElement("button")));
    const dots = [...dotsWrap.children];
    let active = 1; // middle card featured first
    let timer;

    const syncDots = () => dots.forEach((d, i) => d.classList.toggle("is-active", i === active));

    function desktopLayout() {
      cards.forEach((c, i) => {
        const rel = (i - active + n) % n;          // 0 = active
        c.style.order = ""; // Remove any flex order
        c.classList.remove("camp-pos-left", "camp-pos-center", "camp-pos-right");
        if (rel === 0) c.classList.add("camp-pos-center");
        else if (rel === 1) c.classList.add("camp-pos-right");
        else c.classList.add("camp-pos-left");
        
        c.classList.toggle("camp--feature", i === active);
      });
      syncDots();
    }

    function advance() {
      active = (active + 1) % n;
      if (mq.matches) track.scrollTo({ left: cards[active].offsetLeft - track.offsetLeft - 24, behavior: "smooth" });
      else desktopLayout();
      syncDots();
    }
    function restart() { clearInterval(timer); timer = setInterval(advance, 4000); }

    function applyMode() {
      if (mq.matches) {
        cards.forEach((c) => { 
          c.style.order = ""; 
          c.classList.remove("camp--feature", "camp-pos-left", "camp-pos-center", "camp-pos-right"); 
        });
        cards[1] && cards[1].classList.add("camp--feature");
      } else {
        desktopLayout();
      }
      syncDots();
    }

    track.addEventListener("scroll", () => {
      if (!mq.matches) return;
      const center = track.scrollLeft + track.clientWidth / 2;
      let min = Infinity;
      cards.forEach((c, i) => {
        const cc = c.offsetLeft - track.offsetLeft + c.clientWidth / 2;
        if (Math.abs(cc - center) < min) { min = Math.abs(cc - center); active = i; }
      });
      syncDots();
    }, { passive: true });

    dots.forEach((dot, i) => dot.addEventListener("click", () => {
      active = i;
      if (mq.matches) track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft - 24, behavior: "smooth" });
      else desktopLayout();
      syncDots(); restart();
    }));

    track.addEventListener("mouseenter", () => clearInterval(timer));
    track.addEventListener("mouseleave", restart);

    applyMode(); restart();
    mq.addEventListener("change", () => { applyMode(); restart(); });
  };
})();
