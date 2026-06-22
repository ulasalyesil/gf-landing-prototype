# Asset manifest

Drop real files at these exact paths. The code references these names directly — match them and assets appear with zero code changes. Until a file exists, the `onerror` handler removes the `<img>` and a styled `.ph` placeholder (with `data-label`) renders in its place.

Formats: **`.png` and `.svg` only.** No `.jpg`. Running text is **Open Sans** (Google Fonts, weights 400/600/700) — swap via `--font-sans` in `css/tokens.css`.

## Present ✓

**Brand / logos** (`assets/logos/`)
- `getirfinans.svg` — wordmark, light (on dark/photo header)
- `getirfinans-dark.svg` — wordmark, dark (on light)
- `fibabanka-logo.svg`
- `paranaiyibak.svg`, `paranaiyibak.png`

**Badges** (`assets/badges/`) — `app-store.svg`, `google-play.svg`, `app-gallery.svg`

**Icons** (`assets/icons/`) — `arrow-right-circle.svg`, `arrow-right-circle-thin.svg`, `chevron-right.svg` (rates see-more + calc oranlar), `getirpara.svg`, `cashback.svg`, `coin-gold.svg`, `coin-silver.svg`, `flag-usd.svg`, `flag-eur.svg`, `faiz.svg`, `sart-yok.svg`, `ek-hesap.svg` (faiz points)

**Video** (`assets/video/`) — `hero-bg.mp4` (hero bg, autoplay/loop/muted; optional `hero-bg.webm`), `debit-card.mp4` (3D card loop)

**Images** (`assets/img/`)
- `neler-1.png` … `neler-4.png` — "parana iyi bakmanın yolları" cards
- `campaign-1.png`, `campaign-2.png`, `campaign-3.png` — campaigns carousel
- `kredi-woman.png` — loan section
- `faiz-phone-left.png`, `faiz-phone-middle.png`, `faiz-phone-right.png` — 3-phone cluster (classes `.faiz-phone-1/2/3`, staggered in `animations.js`)
- `transfer-phone.png`, `transfer-card-left.png`, `transfer-card-right.png` (transparent cutouts, no container bg)
- `standalone-woman.png` — woman holding phone, app-split (section 11) right side

**Lottie** (`assets/lottie/`) — `ai-assistant.json` — full-width AI section scene (1920×822), loaded into `#aiLottie`

## Unused (kept, not referenced)
- `assets/img/standalone-bg.png` — old "ışıkları kapattık" background, superseded by the app-split gradient

## Missing — rendered as a stand-in
- Debit title "Motorlu Kurye" moped icon: no asset supplied, currently the 🛵 emoji. Drop an SVG at `assets/icons/moped.svg` and swap it in.

## Hero
- Title is static ("ama ne finans!"). The sub-description flips through 3 lines — `js/content.js` (`HERO_SUBS`).
