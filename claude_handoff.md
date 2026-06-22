# GetirFinans Landing Page - Claude Handoff Document

This document summarizes the current state of the GetirFinans landing page prototype, the underlying Vanilla HTML/CSS/JS architecture, and recent structural refinements. Use this context to continue development seamlessly without breaking established patterns.

## Project Architecture

The project is built entirely without a frontend framework to ensure maximum performance and granular animation control.

- **`index.html`**: The unified markup file. It uses semantic HTML5 elements structured sequentially by logical blocks (`.hero`, `.stats`, `.rates`, etc.).
- **CSS Architecture**:
  - `css/tokens.css`: The source of truth for the design system. Contains CSS variables for colors (`--gf-purple`, `--gf-yellow`), typography (`--font-sans` mapped to Open Sans), spacing, and elevation.
  - `css/base.css`: Global resets, typography hierarchy, universal components (like `.btn`), and reusable utility classes (`.reveal` for scroll animations, `.hl`/`.mark` for highlighted headers).
  - `css/sections.css`: Specific grid/flexbox layouts and mobile `@media` queries grouped chronologically by section.
- **JavaScript Modules**:
  - `js/main.js`: Bootstraps the application. Handles global event listeners (like header background/logo toggling on scroll) and the interactive Deposit Calculator mock logic.
  - `js/animations.js`: Houses all GSAP (GreenSock) scroll-triggered animations and timeline orchestrations.
  - `js/carousel.js`: Manages the logic for the "Campaigns" slider, which integrates native CSS horizontal `scroll-snap` with a JS listener to sync pagination dots on mobile.

## Recent Major Refinements

I recently executed a massive visual refinement pass to align the prototype precisely with the Figma designs. When modifying the code, **preserve these specific implementations**:

1. **Brand Typography Integrity**: 
   - We strictly use **Open Sans**. I stripped out excessive `800` and `900` font weights globally. Stick to `400` (regular), `600` (semibold), and `700` (bold) to prevent a cluttered "AI slop" aesthetic.
2. **Animated Section Headers (`.hl` & `.mark`)**:
   - The yellow underline highlight is **not** a background gradient anymore. It is an absolutely positioned `::after` pseudo-element built in `base.css` that overlaps the text by `-4px` (simulating the `-24px` design spec gap) and dynamically animates `width: 0 -> 100%` when `.reveal.is-in` triggers.
3. **Continuous Background Groupings**:
   - The *Kredi*, *Faiz*, and *Calculator* sections (`index.html` lines ~190-260) are intentionally wrapped inside a `.bg-lilac-wrap` div. Do not add individual background colors to these sections, as they rely on this wrapper for a seamless flowing design.
4. **Button Component (`.btn`)**:
   - Buttons have exact Figma spacing (`padding: 12px 24px 12px 16px; gap: 8px;`) and *no box-shadows*. They utilize embedded SVG `<img src="assets/icons/arrow-right-circle.svg">` tags instead of inline SVGs.
5. **Mobile native Scroll-Snap**:
   - The `.campaigns__track` utilizes pure CSS `scroll-snap-type: x mandatory` for mobile swiping (`sections.css`). Do not attempt to force `display: none` via JS for the cards; let the CSS natively handle the scroll physics.
6. **GSAP Staggered Animations**:
   - Complex visuals (like the three overlapping `.faiz-phone-*` images) are absolutely positioned in CSS and orchestrated via precise `gsap.timeline()` stagger reveals in `animations.js`. 

## Next Steps / How to Contribute

- **Assets:** All `.jpg` placeholders have been completely eradicated. Only reference `.png` and `.svg` files located in `assets/img/`, `assets/logos/`, and `assets/icons/`.
- **Testing:** The project does not require a build step for CSS/JS. You can simply serve it via any static local HTTP server (e.g., `python3 -m http.server` or `npm run dev` if a package script exists) and test directly in the browser. 

*Claude: When picking up from here, please review the latest `css/sections.css` media queries and `index.html` structure before proposing layout rewrites to avoid regressions.*
