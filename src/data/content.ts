export interface HeroOffer {
  title: string;
  sub: string;
}

export const HERO_OFFERS: HeroOffer[] = [
  { title: "yıllık %44 faizle",           sub: "paranı bağlamadan<br>her gün iyi kazan" },
  { title: "uygun oranlı kredi",          sub: "aylık %3,49’dan başlayan faizlerle" },
  { title: "çok iyi kurlar",              sub: "hafta içi akşamları bile<br>dar makasla işlem yap" },
  { title: "%1 nakit iadeli hesap kartı", sub: "kartın dakikalar içinde kapında<br>harcarken geri kazan" }
];

export const HERO_BADGES: string[] = [
  "1.000.000+ getirfinanslı",
  "her 4 getirfinanslıdan biri referans koduyla geliyor"
];

export const HERO_FLIP_MS = 4000;

export interface RateItem {
  code: string;
  name: string;
  flag: string;
  price: number;
  al: number;
  sat: number;
  dec: number;
  dir?: number;
  pct?: number;
}

export const RATES_SEED: RateItem[] = [
  { code: "USD", name: "Amerikan Doları", flag: "🇺🇸", price: 46.4865, al: 46.7899, sat: 46.1830, dec: 4 },
  { code: "XAU", name: "altın",          flag: "🥇", price: 6820.66,  al: 6864.99, sat: 6776.33, dec: 2 },
  { code: "XAG", name: "gümüş",          flag: "🥈", price: 107.4824, al: 108.1810, sat: 106.7837, dec: 4 },
  { code: "EUR", name: "Euro",           flag: "🇪🇺", price: 52.5478,  al: 52.8893, sat: 52.2063, dec: 4 }
];

export const RATES_CYCLE_MS = 180000;
