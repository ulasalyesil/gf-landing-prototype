/* Editable content — swap freely */

// Hero cycles through offer pairs: bold title line = the offer, sub = support.
// Title and sub flip together, in sync (see initHeroOffers).
window.HERO_OFFERS = [
  { title: "yıllık %44 faizle",           sub: "paranı bağlamadan her gün iyi kazan" },
  { title: "uygun oranlı kredi",          sub: "aylık %3,49’dan başlayan faizlerle" },
  { title: "çok iyi kurlar",              sub: "hafta içi akşamları bile dar makasla işlem yap" },
  { title: "%1 nakit iadeli hesap kartı", sub: "kartın dakikalar içinde kapında, harcarken geri kazan" }
];

// Rates seed (realistic mock). al = buy, sat = sell.
window.RATES_SEED = [
  { code: "USD", name: "Amerikan Doları", flag: "🇺🇸", price: 46.4865, al: 46.7899, sat: 46.1830, dec: 4 },
  { code: "XAU", name: "altın",          flag: "🥇", price: 6820.66,  al: 6864.99, sat: 6776.33, dec: 2 },
  { code: "XAG", name: "gümüş",          flag: "🥈", price: 107.4824, al: 108.1810, sat: 106.7837, dec: 4 },
  { code: "EUR", name: "Euro",           flag: "🇪🇺", price: 52.5478,  al: 52.8893, sat: 52.2063, dec: 4 }
];

// Rate refresh cycle (ms). Real site is 3 minutes; shortened slightly so the
// live-update tick is visible during a demo. Set to 180000 for true 3-min.
window.RATES_CYCLE_MS = 180000;
