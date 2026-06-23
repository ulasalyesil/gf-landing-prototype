# GetirFinans Landing Page - Claude Handoff Document

This document summarizes the current state of the GetirFinans landing page prototype, the underlying Vanilla HTML/CSS/JS architecture, and recent structural refinements. Use this context to continue development seamlessly without breaking established patterns.

## Project Architecture

The project is built entirely without a frontend framework to ensure maximum performance and granular animation control.

- **`index.html`**: The unified markup file. It uses semantic HTML5 elements structured sequentially by logical blocks (`.hero`, `.stats`, `.rates`, etc.).
- **CSS Architecture**:
  - `css/tokens.css`: The source of truth for the design system. Contains CSS variables for colors (`--gf-purple`, `--gf-yellow`), typography (`--font-sans` mapped to Open Sans), spacing, and elevation.
  - `css/base.css`: Global resets, typography hierarchy, universal components (like `.btn`), and reusable utility classes (`.reveal` for scroll animations, `.hl`/`.mark` for highlighted headers).
  - `css/sections.css`: Specific grid/flexbox layouts and massive mobile `@media` queries grouped at the bottom for responsive behavior.
- **JavaScript Modules**:
  - `js/main.js`: Bootstraps the application. Handles global event listeners (like header background/logo toggling on scroll), the interactive Deposit Calculator mock logic, the manual dark-mode section toggle, and the mobile hamburger menu overlay.
  - `js/animations.js`: Houses all GSAP (GreenSock) scroll-triggered animations and timeline orchestrations.
  - `js/carousel.js`: Manages the logic for the "Campaigns" slider.

## Recent Major Refinements

I recently executed several major functionality and responsiveness passes. When modifying the code, **preserve these specific implementations**:

1. **Full Mobile Responsiveness (`max-width: 991px`)**: 
   - A global media query block resides at the bottom of `css/sections.css`. It overrides desktop grids (`grid-template-columns: 1fr 1fr`) to single columns and stacks complex layouts.
   - The desktop `.nav` is hidden on mobile, replaced by a bespoke animated hamburger menu (`#mobileMenuBtn`) that triggers a full-screen `.mobile-menu` overlay.
2. **Interactive Dark Mode Toggle (Promotional)**:
   - We added an alternative to the standalone app section (`.app-dark`). It is *not* tied to the OS `@media (prefers-color-scheme: dark)`. Instead, users can click the `.app-split__title` or `.app-dark__title` to manually toggle between the light and dark layouts via JS class swapping (`is-active` / `is-hidden`) in `js/main.js`.
3. **Mobile Native Scroll-Snap**:
   - The `.campaigns__track` and `.rates__cards` utilize pure CSS `scroll-snap-type: x mandatory` for mobile swiping (`sections.css`). Do not attempt to force `display: none` via JS for the cards; let the CSS natively handle the scroll physics.
4. **Hero Video Fade**:
   - The hero video fading to black at the end of its loop is controlled dynamically via a `timeupdate` event listener in `js/main.js` that applies an `is-fading` class, ensuring perfect sync regardless of buffering delays.
5. **Animated Section Headers (`.hl` & `.mark`)**:
   - The yellow underline highlight is **not** a background gradient. It is an absolutely positioned `::after` pseudo-element built in `base.css` that dynamically animates `width: 0 -> 100%` when `.reveal.is-in` triggers.
6. **Continuous Background Groupings**:
   - The *Kredi*, *Faiz*, and *Calculator* sections (`index.html` lines ~190-260) are intentionally wrapped inside a `.bg-lilac-wrap` div for a seamless flowing background.

## Next Steps / How to Contribute

- **Assets:** All `.jpg` placeholders have been completely eradicated. Only reference `.png` and `.svg` files located in `assets/img/`, `assets/logos/`, and `assets/icons/`.
- **Testing:** The project does not require a build step for CSS/JS. You can simply serve it via any static local HTTP server and test directly in the browser. 

*Claude: When picking up from here, please deeply review the mobile override block at the end of `css/sections.css` and the toggle logic in `js/main.js` before proposing any architectural rewrites to avoid regressions.*
