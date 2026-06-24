/* Bootstrap */
(function () {
  // Header background on scroll
  const header = document.getElementById("siteHeader");
  const logo = document.querySelector(".brand__logo");
  const onScroll = () => {
    const isScrolled = window.scrollY > 40;
    header.classList.toggle("is-scrolled", isScrolled);
    // Over the hero (top) the header is transparent → white logo; once the white
    // header bg appears on scroll → purple logo.
    if (logo) logo.src = isScrolled ? "assets/logos/getirfinans.svg" : "assets/logos/getirfinans-dark.svg";
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mega dropdown (nav). All three triggers open the products panel.
  const mega = document.getElementById("megaMenu");
  const navItems = [...document.querySelectorAll(".nav__item")];
  const megaCloseMs = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--dropdown-close-dur")) || 150;
  let openItem = null, megaCloseTimer;
  function closeMega() {
    if (!mega || !openItem) return;
    mega.classList.remove("is-open");
    mega.classList.add("is-closing");                 // play the close scale, then reset to rest
    mega.setAttribute("aria-hidden", "true");
    clearTimeout(megaCloseTimer);
    megaCloseTimer = setTimeout(() => mega.classList.remove("is-closing"), megaCloseMs);
    header.classList.remove("is-mega");
    navItems.forEach((n) => n.classList.remove("is-open"));
    openItem = null;
    onScroll(); // restore logo for current scroll position
  }
  function openMega(item) {
    if (!mega) return;
    clearTimeout(megaCloseTimer);
    mega.classList.remove("is-closing");
    mega.classList.add("is-open");
    mega.setAttribute("aria-hidden", "false");
    header.classList.add("is-mega");
    navItems.forEach((n) => n.classList.toggle("is-open", n === item));
    if (logo) logo.src = "assets/logos/getirfinans.svg"; // purple over white bar
    openItem = item;
  }
  navItems.forEach((item) => item.addEventListener("click", (e) => {
    e.stopPropagation();
    openItem === item ? closeMega() : openMega(item);
  }));
  mega && mega.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("click", closeMega);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMega(); });
  window.addEventListener("scroll", closeMega, { passive: true });

  // Sliding indicator (transitions.dev tabs-sliding): write the active item's
  // offsetLeft/offsetWidth onto an absolutely-positioned pill/underline. First
  // paint + resize snap without a transition; clicks tween.
  function slideIndicator(ind, target, animate) {
    if (!ind || !target) return;
    const write = () => { ind.style.transform = `translateX(${target.offsetLeft}px)`; ind.style.width = `${target.offsetWidth}px`; };
    if (animate) { write(); return; }
    const prev = ind.style.transition;
    ind.style.transition = "none";
    write();
    void ind.offsetWidth; // reflow so the snap lands before any later tween
    ind.style.transition = prev;
  }

  // Calculator tabs (visual) — sliding underline
  const calcTabs = [...document.querySelectorAll(".calc__tab")];
  const calcUnderline = document.querySelector(".calc__tabs-underline");
  const activeTab = () => calcTabs.find((t) => t.classList.contains("is-active")) || calcTabs[0];
  calcTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      calcTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      slideIndicator(calcUnderline, tab, true);
      document.dispatchEvent(new CustomEvent("calc:tab", { detail: tab.dataset.tab }));
    });
  });

  // Currency segmented control — sliding pill
  const curBtns = [...document.querySelectorAll(".calc-currency__btn")];
  const curPill = document.querySelector(".calc-currency__pill");
  const activeCur = () => curBtns.find((b) => b.classList.contains("is-active")) || curBtns[0];
  curBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      curBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      slideIndicator(curPill, btn, true);
    });
  });

  // Position both indicators on first paint + keep them aligned on resize.
  requestAnimationFrame(() => {
    slideIndicator(calcUnderline, activeTab(), false);
    slideIndicator(curPill, activeCur(), false);
  });
  window.addEventListener("resize", () => {
    slideIndicator(calcUnderline, activeTab(), false);
    slideIndicator(curPill, activeCur(), false);
  }, { passive: true });

  // Calculator logic mock
  const calcBtn = document.getElementById("calcBtn");
  const calcAmount = document.getElementById("calcAmount");
  const calcDays = document.getElementById("calcDays");
  if (calcBtn && calcAmount && calcDays) {
    const calcLabel = calcBtn.querySelector(".calc-btn__label");
    const calcCheck = calcBtn.querySelector(".calc-btn__check");
    let calcResetTimer;
    calcBtn.addEventListener("click", () => {
      const a = parseFloat(calcAmount.value.replace(/\./g, "")) || 0;
      const d = parseInt(calcDays.value, 10) || 0;
      const gross = (a * 44 / 100) * (d / 365);
      const net = gross * 0.925; // 7.5% stopaj kesintisi mock
      const tl = (n) => `₺ ${Math.floor(n).toLocaleString("tr-TR")}`;

      document.getElementById("resNet").textContent = tl(net);
      document.getElementById("resTotal").textContent = tl(a + net);
      document.getElementById("resPrincipal").textContent = tl(a);

      const date = new Date();
      date.setDate(date.getDate() + d);
      document.getElementById("resDate").textContent = date.toLocaleDateString("tr-TR");

      // Success moment: draw the check, swap the label (keeps the inner spans intact)
      if (calcLabel) calcLabel.textContent = "hesaplandı";
      calcBtn.classList.add("is-done");
      calcBtn.style.background = "var(--gf-up)";
      if (calcCheck) { calcCheck.setAttribute("data-state", "out"); void calcCheck.offsetWidth; calcCheck.setAttribute("data-state", "in"); }
      clearTimeout(calcResetTimer);
      calcResetTimer = setTimeout(() => {
        if (calcLabel) calcLabel.textContent = "hesapla";
        calcBtn.classList.remove("is-done");
        if (calcCheck) calcCheck.setAttribute("data-state", "out");
        calcBtn.style.background = "";
      }, 2000);
    });
  }

  // Optional Lottie for the AI section (loads only if file present)
  function tryLottie(mountId, path) {
    const mount = document.getElementById(mountId);
    if (!mount || !window.lottie) return;
    fetch(path, { method: "HEAD" }).then((r) => {
      if (!r.ok) return;
      mount.classList.remove("ph");
      mount.querySelector("img")?.remove();
      const anim = window.lottie.loadAnimation({ container: mount, renderer: "svg", loop: false, autoplay: false, path });
      if (window.ScrollTrigger) {
        ScrollTrigger.create({ trigger: mount, start: "top 80%", once: true, onEnter: () => anim.play() });
      } else {
        anim.play();
      }
    }).catch(() => {});
  }

  // Remove videos whose sources fail to load (so placeholders show instead of a black box).
  // The hero video is exempt: its container keeps a brand-gradient fallback, and pruning
  // it on a transient readyState=0 (e.g. when scrolled offscreen and back) was leaving the
  // hero with a bare gray overlay.
  function pruneBrokenVideos() {
    document.querySelectorAll("video").forEach((v) => {
      if (v.closest(".hero")) return;
      const kill = () => v.remove();
      v.addEventListener("error", kill, true); // capture: catches <source> errors
      setTimeout(() => { if (v.isConnected && v.readyState === 0) v.remove(); }, 1500);
    });
  }

  // Static-preview hook: ?static reveals everything and skips entrance animation (for visual QA)
  const STATIC = location.search.includes("static");
  if (STATIC) {
    document.documentElement.classList.add("static-preview");
    document.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach((e) => e.classList.add("is-in"));
  }

  function start() {
    pruneBrokenVideos();
    window.initRates && window.initRates();
    window.initHeroFlip && window.initHeroFlip();
    window.initCampaigns && window.initCampaigns();
    window.initAnimations && window.initAnimations();
    tryLottie("aiLottie", "assets/lottie/ai-assistant.json");
    
    const heroVideo = document.querySelector(".hero__video");
    if (heroVideo) {
      heroVideo.addEventListener("timeupdate", () => {
        if (heroVideo.duration && (heroVideo.duration - heroVideo.currentTime) < 0.6) {
          heroVideo.classList.add("is-fading");
        } else {
          heroVideo.classList.remove("is-fading");
        }
      });
    }
    // Hero badge text now flips in lockstep with the title/subtitle via initHeroFlip.
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
