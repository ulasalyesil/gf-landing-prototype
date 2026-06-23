/* Scroll-driven entrance animation engine — GSAP + ScrollTrigger.
   Goal: the page feels alive. Every section reveals with intent; key sections
   get signature moves. */
(function () {
  window.initAnimations = function () {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      || document.documentElement.classList.contains("static-preview");
    if (reduce || !window.gsap) {
      document.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach(el => el.classList.add("is-in"));
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const EASE = "power3.out";
    const START = "top 82%";

    // ---- Hero load-in (no scroll trigger) ----
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl
      .from(".hero__badge-stack", { y: 24, opacity: 0, duration: .7, delay: .15 })
      .from(".hero__title", { y: 40, opacity: 0, duration: .9 }, "-=.45")
      .from(".hero__sub", { y: 28, opacity: 0, duration: .7 }, "-=.55")
      .from(".hero__cta", { y: 24, opacity: 0, scale: .96, duration: .6 }, "-=.45")
      .from(".hero__bankinfo", { opacity: 0, duration: .6 }, "-=.3");

    // hero subtle parallax + scrim deepen on scroll
    // (disabled because it causes top-edge gap issues with smooth scrolling / scaling)
    // gsap.to(".hero__video", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    // ---- Generic reveals ----
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.fromTo(el, { y: 36, opacity: 0 }, {
        y: 0, opacity: 1, duration: .9, ease: EASE,
        scrollTrigger: { trigger: el, start: START, toggleActions: "play none none none" },
        onComplete: () => el.classList.add("is-in")
      });
    });

    // ---- Directional reveals ----
    gsap.utils.toArray(".reveal-left").forEach((el) => {
      gsap.fromTo(el, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: EASE,
        scrollTrigger: { trigger: el, start: START }, onComplete: () => el.classList.add("is-in") });
    });
    gsap.utils.toArray(".reveal-right").forEach((el) => {
      gsap.fromTo(el, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: EASE,
        scrollTrigger: { trigger: el, start: START }, onComplete: () => el.classList.add("is-in") });
    });

    // ---- Debit underline + courier: fire .is-in 0.8s before the copy reveal (1s) completes ----
    const debitCopy = document.querySelector(".debit__copy");
    if (debitCopy) {
      ScrollTrigger.create({
        trigger: debitCopy, start: START, once: true,
        onEnter: () => gsap.delayedCall(0.2, () => debitCopy.classList.add("is-in"))
      });
    }

    // ---- Staggered groups ----
    gsap.utils.toArray("[data-stagger]").forEach((group) => {
      const kids = group.children;
      gsap.fromTo(kids, { y: 44, opacity: 0, scale: .97 }, {
        y: 0, opacity: 1, scale: 1, duration: .8, ease: EASE, stagger: .12,
        scrollTrigger: { trigger: group, start: START }
      });
    });

    // ---- Count-up numbers ----
    gsap.utils.toArray("[data-count]").forEach((el) => {
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: () => gsap.to(obj, {
          v: end, duration: 1.8, ease: "power2.out",
          onUpdate: () => { el.textContent = Math.floor(obj.v).toLocaleString("tr-TR") + suffix; }
        })
      });
    });

    // ---- Signature: faiz phones (now using generic reveal from HTML) ----

    // ---- Signature: transfer phone + cards fly in ----
    const tStage = document.querySelector(".transfer__stage");
    if (tStage) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: tStage, start: "top 72%" } });
      tl.fromTo(".transfer__phone", { y: 60, opacity: 0, scale: .94 }, { y: 0, opacity: 1, scale: 1, duration: .9, ease: "power3.out" })
        .fromTo(".transfer__card--left",  { xPercent: -50, yPercent: -30, x: 0, rotate: 0, opacity: 0 },
                                          { x: -185, rotate: -11, opacity: 1, duration: .8, ease: "power3.out" }, "-=.45")
        .fromTo(".transfer__card--right", { xPercent: -50, yPercent: -30, x: 0, rotate: 0, opacity: 0 },
                                          { x: 185, rotate: 11, opacity: 1, duration: .8, ease: "power3.out" }, "-=.7");

      // Hover interaction to expand and flatten cards
      tStage.addEventListener("mouseenter", () => {
        gsap.to(".transfer__card--left", { x: -240, rotate: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        gsap.to(".transfer__card--right", { x: 240, rotate: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
      });
      tStage.addEventListener("mouseleave", () => {
        gsap.to(".transfer__card--left", { x: -185, rotate: -11, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        gsap.to(".transfer__card--right", { x: 185, rotate: 11, duration: 0.5, ease: "power2.out", overwrite: "auto" });
      });
    }

    // ---- App split: woman image subtle parallax ----
    if (document.querySelector(".app-split__media")) {
      gsap.fromTo(".app-split__media img", { scale: 1.12 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: ".app-split", start: "top bottom", end: "bottom top", scrub: true }
      });
    }

    // ---- Signature: debit card gentle float (continuous) ----
    gsap.to(".debit__media", { y: -12, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });

    // ---- Section headline mark wipe ----
    gsap.utils.toArray(".h-sec .mark").forEach((m) => {
      gsap.fromTo(m, { backgroundSize: "0% 42%" }, {
        backgroundSize: "100% 42%", duration: .8, ease: "power2.out",
        scrollTrigger: { trigger: m, start: "top 85%" }
      });
    });
  };
})();
