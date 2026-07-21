export interface HeroOffer {
  /** May carry inline HTML (rendered via dangerouslySetInnerHTML, same as sub). */
  title: string;
  sub: string;
}

export const HERO_OFFERS: HeroOffer[] = [
  /* "yıllık" de-emphasized as a small cap above the % — revizyon feedback:
     the annual rate was overpowering the daily-earn message */
  { title: "<small class='hero__title-yr'>yıllık</small>%44 faizle", sub: "paranı bağlamadan<br>her gün iyi kazan" },
  { title: "iyi faizli kredi",            sub: "aylık %3,49’dan başlayan faizlerle" },
  { title: "çok iyi kurlar",              sub: "hafta içi akşamları bile<br>dar makasla işlem yap" },
  { title: "%1 nakit iadeli hesap kartı", sub: "kartın dakikalar içinde kapında<br>harcarken geri kazan" }
];

export const HERO_BADGES: string[] = [
  "1.000.000+ getirfinanslı",
  "her 4 getirfinanslı’dan 1’i referans koduyla geliyor"
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

/* ===== /hesap-karti (GFDES-2174) ===== */
/* Steps copy is a Turkish draft replacing the English template text —
   needs owner + legal review before lock (esp. anything fee-related). */

export const DEBIT_HERO = {
  badge: "kartın dakikalar içinde kapında",
  title: "geri dönüşü",
  titleHl: "muhteşem kart",
  sub: "ücretsiz hesap kartınla fiziksel harcamalarında %1 nakit iade kazan",
  cta: "kart al"
};

export const DEBIT_EARN = {
  title: "harcadıkça getirpara",
  titleHl: "ve nakit iade kazan",
  sub: "su siparişinden markete, akaryakıttan alışverişe nakit iade kazanırken; getirmarket ve bitaksi'de getirpara ile kazancını katla",
  iade: "fiziksel tüm harcamalarına aylık ₺1.250'ye kadar anında nakit iade!",
  getirpara: { pre: "getirmarket ve bitaksi'de yapacağın harcamalara ", em: "%3", post: " getirpara" }
};

export interface DebitStep {
  title: string;
  /** Two explicit lines. Equal-height copy keeps the three progress bars
      on one baseline — a 1-line step would lift its bar out of alignment. */
  desc: [string, string];
}

export const DEBIT_STEPS_SECTION = {
  title: "hızlı kart",
  titleHl: "teslimatı",
  sub: "kartın dakikalar içinde kapında",
  cta: "kart al"
};

/* step titles: owner (2026-07-13); desc lines are DRAFT — need owner review */
export const DEBIT_STEPS: DebitStep[] = [
  { title: "kartını iste",                desc: ["hesap kartını uygulamadan", "tek dokunuşla iste"] },
  { title: "ücretsiz kurye teslim etsin", desc: ["kurye kartını dakikalar içinde", "adresine teslim etsin"] },
  { title: "kazanmaya başla",             desc: ["harcadıkça nakit iade", "ve getirpara kazan"] }
];

/* "neler var?" answers what the PHYSICAL card does — attributes of the card
   you just ordered. Sanal kart is a distinct product, so it owns a section. */
export const DEBIT_CAPS = {
  title: "hesap kartında",
  titleHl: "daha neler var?",
  transfer: { stat: "7/24", title: "ücretsiz para transferi", sub: "havale, EFT ve FAST", media: "/assets/img/debit-cap-transfer.svg" },
  /* numeric: rendered via AnimatedNumber (counts up on appear, tr-TR "5.355") */
  atm: { stat: 5355, title: "anlaşmalı ATM", sub: "Fibabanka ve Akbank ATM'lerinden ücretsiz para çek, yatır", media: "/assets/img/debit-cap-atm.svg" }
};

/* Own section — dark, full-bleed (landing `.debit` grammar). Heading is a
   benefit-led draft; needs owner review. "özel" avoided per GF wording rules. */
export const DEBIT_SANAL = {
  id: "sanal-kart",
  title: "sanal hesap kartıyla",
  titleHl: "güvenle harca",
  cta: "kart al",
  features: [
    "harcamaların için ayrı kartlar oluştur, rahatça takip et",
    "internet alışverişlerini güvenle yap",
    "her kartın için limitini belirle, bütçeni kontrol et"
  ],
  media: "/assets/img/virtual-card.png"
};

export const DEBIT_ABROAD = {
  title: "hesap kartınla yurtdışında",
  titleHl: "yapılacaklar listesi",
  /* \n = hard line break (li renders white-space: pre-line) */
  captions: [
    "avantajlı kurlarla\nharcama yap",
    "yurt dışında harcarken de %1 nakit iade kazan",
    "ATM'den para çekerken komisyonu avantajlı kurla öde"
  ]
};

/* ===== Newsletter (gazete, landing) ===== */
export interface NewsletterPage {
  src: string;
  alt: string;
}

export const NEWSLETTER = {
  title: "paranın gündemi",
  titleHl: "getirfinans gazetesi'nde",
  lead: "kampanyalar, ipuçları ve finans gündemi her ay gazetende",
  cta: "gazeteyi oku",
  /* CTA target: real newsletter URL pending — placeholder like the other page CTAs */
  href: "#",
  issue: { no: "sayı 01", date: "temmuz 2026" },
  pageAspect: "1191 / 1684",
  pages: [
    { src: "/assets/newsletter/sayfa-01@2x.webp", alt: "getirfinans gazetesi, sayfa 1: kapak" },
    { src: "/assets/newsletter/sayfa-02@2x.webp", alt: "getirfinans gazetesi, sayfa 2" },
    { src: "/assets/newsletter/sayfa-03@2x.webp", alt: "getirfinans gazetesi, sayfa 3" },
    { src: "/assets/newsletter/sayfa-04@2x.webp", alt: "getirfinans gazetesi, sayfa 4: arka kapak" },
  ] as NewsletterPage[],
};
