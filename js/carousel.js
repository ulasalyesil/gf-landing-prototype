/* Hero title swap, hero badge swap, campaign auto-swipe carousel */
(function () {
  // ---- Hero flip: title + subtitle + badge swap together (transitions.dev text-states-swap) ----
  // All three share the same .t-text-swap motion and the same tick, so the badge on top
  // stays in perfect lockstep with the title/subtitle below.
  window.initHeroFlip = function () {
    const titleEl = document.querySelector(".hero__title-swap");
    const subEl = document.getElementById("heroSub");
    const badgeEl = document.getElementById("heroBadge");
    if (!titleEl || !subEl || !window.HERO_OFFERS || window.HERO_OFFERS.length < 2) return;

    const offers = window.HERO_OFFERS;
    const badges = window.HERO_BADGES || [];
    const dur = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--text-swap-dur")
    ) || 150;

    // Three-phase swap on one element:
    //   1. .is-exit          — old text exits up + blurs + fades.
    //   2. after --text-swap-dur, change textContent + .is-enter-start (jump below,
    //      no transition), force reflow.
    //   3. remove .is-enter-start — new text settles back to rest.
    function swap(el, next) {
      if (!el || next == null) return;
      el.classList.add("is-exit");
      setTimeout(() => {
        el.textContent = next;
        el.classList.remove("is-exit");
        el.classList.add("is-enter-start");
        void el.offsetHeight; // reflow so the enter animates
        el.classList.remove("is-enter-start");
      }, dur);
    }

    let i = 0;
    setInterval(() => {
      i = (i + 1) % offers.length;
      swap(titleEl, offers[i].title);
      swap(subEl, offers[i].sub);
      if (badges.length) swap(badgeEl, badges[i % badges.length]);
    }, window.HERO_FLIP_MS || 4000);
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
