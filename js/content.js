/* Editable content — swap freely */

// Hero headline is static: "ama ne finans!" (set in index.html, no rotation).
// The sub-description flips through these three lines instead.
// Each line breaks after the comma (the renderer turns ", " into a line break).
window.HERO_SUBS = [
  "iyi faizle her gün kazan, uygun oranlı kredi kullan.",
  "iyi kurlarla işlem yap, hafta içi akşamları bile.",
  "kartın dakikalar içinde gelsin, harcarken geri kazan."
];

// Rates seed (realistic mock). al = buy, sat = sell.
window.RATES_SEED = [
  { code: "USD", name: "Amerikan Doları", flag: "🇺🇸", price: 43.2343, al: 43.8530, sat: 43.2313, dec: 4 },
  { code: "XAU", name: "altın",          flag: "🥇", price: 6820.66, al: 6820.66, sat: 6810.66, dec: 2 },
  { code: "XAG", name: "gümüş",          flag: "🥈", price: 107.4824, al: 107.4824, sat: 107.4500, dec: 4 },
  { code: "EUR", name: "Euro",           flag: "🇪🇺", price: 52.5478, al: 52.5468, sat: 52.5203, dec: 4 }
];

// Rate refresh cycle (ms). Real site is 3 minutes; shortened slightly so the
// live-update tick is visible during a demo. Set to 180000 for true 3-min.
window.RATES_CYCLE_MS = 180000;
