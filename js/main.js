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
  let openItem = null;
  function closeMega() {
    if (!mega || !openItem) return;
    mega.hidden = true;
    header.classList.remove("is-mega");
    navItems.forEach((n) => n.classList.remove("is-open"));
    openItem = null;
    onScroll(); // restore logo for current scroll position
  }
  function openMega(item) {
    if (!mega) return;
    mega.hidden = false;
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

  // Calculator tabs (visual)
  document.querySelectorAll(".calc__tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".calc__tab").forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      document.dispatchEvent(new CustomEvent("calc:tab", { detail: tab.dataset.tab }));
    });
  });

  // Calculator logic mock
  const calcBtn = document.getElementById("calcBtn");
  const calcAmount = document.getElementById("calcAmount");
  const calcDays = document.getElementById("calcDays");
  if (calcBtn && calcAmount && calcDays) {
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
      
      calcBtn.textContent = "hesaplandı ✓";
      calcBtn.style.background = "var(--gf-up)";
      setTimeout(() => {
        calcBtn.textContent = "hesapla";
        calcBtn.style.background = "";
      }, 2000);
    });
    
    // Currency toggle
    document.querySelectorAll(".calc-currency__btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".calc-currency__btn").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
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
    window.initHeroOffers && window.initHeroOffers();
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
    
    // Hero stat badge — shown alongside the stats section (both bars), cycles on load
    const heroBadgeStack = document.getElementById("heroBadgeStack");
    if (heroBadgeStack && !heroBadgeStack.dataset.rotating) {
      const badges = heroBadgeStack.querySelectorAll(".hero__badge");
      if (badges.length > 1) {
        heroBadgeStack.dataset.rotating = "true";
        let currentBadgeIndex = 0;
        setInterval(() => {
          badges[currentBadgeIndex].classList.remove("is-on");
          currentBadgeIndex = (currentBadgeIndex + 1) % badges.length;
          badges[currentBadgeIndex].classList.add("is-on");
        }, 3000);
      }
    }
    
    // Toggle standalone app section (Light <-> Dark) via Title Click
    const appSplit = document.getElementById("apps");
    const appDark = document.getElementById("apps-dark");
    if (appSplit && appDark) {
      const splitTitle = appSplit.querySelector(".app-split__title");
      const darkTitle = appDark.querySelector(".app-dark__title");
      
      if (splitTitle && darkTitle) {
        splitTitle.addEventListener("click", () => {
          appSplit.classList.add("is-hidden");
          appDark.classList.add("is-active");
          // Re-trigger scroll animations so elements fade in properly in the new section
          if (window.ScrollTrigger) ScrollTrigger.refresh();
        });
        darkTitle.addEventListener("click", () => {
          appDark.classList.remove("is-active");
          appSplit.classList.remove("is-hidden");
          if (window.ScrollTrigger) ScrollTrigger.refresh();
        });
      }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
