/* Scroll-driven entrance animation engine — GSAP + ScrollTrigger.
   Goal: the page feels alive. Every section reveals with intent; key sections
   get signature moves. */
(function () {
  window.initAnimations = function () {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      || document.documentElement.classList.contains("static-preview");
    if (reduce || !window.gsap) {
      document.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach(el => el.classList.add("is-in"));
      document.querySelector(".loan__copy")?.classList.add("is-in"); // snap timeline is skipped here; still show the underline
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
      gsap.fromTo(el, { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: .6, ease: EASE,
        scrollTrigger: { trigger: el, start: START, toggleActions: "play none none none" },
        onComplete: () => el.classList.add("is-in")
      });
    });

    // ---- Directional reveals ----
    gsap.utils.toArray(".reveal-left").forEach((el) => {
      gsap.fromTo(el, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: .6, ease: EASE,
        scrollTrigger: { trigger: el, start: START }, onComplete: () => el.classList.add("is-in") });
    });
    gsap.utils.toArray(".reveal-right").forEach((el) => {
      gsap.fromTo(el, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: .6, ease: EASE,
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
      if (!kids.length) return; // skip empty groups (e.g. nested [data-*] without children)
      gsap.fromTo(kids, { y: 24, opacity: 0, scale: .98 }, {
        y: 0, opacity: 1, scale: 1, duration: .6, ease: EASE, stagger: .06,
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

    // ---- Moped travels the underline on GPU (transform); distance measured, set as --travel ----
    const debitMark = document.querySelector(".debit__title .mark");
    const moto = document.querySelector(".debit__moto");
    if (debitMark && moto) {
      const setTravel = () => moto.style.setProperty("--travel", (debitMark.offsetWidth + 28) + "px");
      setTravel();
      window.addEventListener("resize", setTravel, { passive: true });
    }

    // ---- Kredi: image fills the section, then shrinks into the square — tied to scroll ----
    // GPU-only clip-path, driven directly by scroll progress (no timeline / keyframes).
    // Expanded band covers the full section (width + height) so no lilac shows top/bottom.
    const kSnap = document.querySelector(".loan__snap");
    const kMedia = document.querySelector(".loan__media");
    const kCopy = document.querySelector(".loan__copy");
    const kSection = document.getElementById("kredi");
    if (kSnap && kMedia && kSection) {
      let ins = { t: 0, r: 0, b: 0, l: 0 }; // square insets relative to the expanded band
      // Expand the snap symmetrically around the square's centre — equal overhang on every
      // side — so the focal point (the woman) stays put while the frame closes in on it, and
      // the band still bleeds past the viewport edges + fills the section (no lilac stripes).
      const measure = () => {
        const m = kMedia.getBoundingClientRect();
        const s = kSection.getBoundingClientRect();
        const vw = document.documentElement.clientWidth;
        const eh = Math.max(m.left, vw - m.right);                 // cover the farther horizontal edge
        const ev = Math.max(m.top - s.top, s.bottom - m.bottom);   // cover the taller section gap
        gsap.set(kSnap, { left: -eh, top: -ev, width: m.width + 2 * eh, height: m.height + 2 * ev });
        ins = { t: ev, r: eh, b: ev, l: eh };
      };
      // p = 0 → full-section image; p = 1 → cropped into the square. Copy fades in over the back half.
      const apply = (p) => {
        kSnap.style.clipPath = `inset(${ins.t * p}px ${ins.r * p}px ${ins.b * p}px ${ins.l * p}px round ${24 * p}px)`;
        const cp = Math.min(1, Math.max(0, (p - 0.55) / 0.45));
        kCopy.style.opacity = cp;
        kCopy.style.transform = `translateX(${-40 * (1 - cp)}px)`;
        kCopy.classList.toggle("is-in", cp > 0.5); // wipes the title underline
      };
      measure(); apply(0);
      // Collapse finishes by the time the section is centred, so the copy + square
      // are on screen when the section sits in the middle of the viewport.
      ScrollTrigger.create({
        trigger: kSection, start: "top bottom", end: "center center",
        onRefresh: (self) => { measure(); apply(self.progress); },
        onUpdate: (self) => apply(self.progress)
      });
    }
  };
})();
