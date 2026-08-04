/* ===== Site navigation =====
   One source for both header surfaces: the desktop nav + mega dropdown and the
   ≤920px hamburger menu. Before this existed the mega panel was hardcoded JSX and
   rendered the same product grid whichever category you clicked. */

export interface NavItem {
  label: string;
  href: string;
  /* Supporting line under the label. May carry inline HTML (rendered via
     dangerouslySetInnerHTML, same as HeroOffer.sub) — authored here in the repo,
     never user input. Hidden on the mobile menu by default; see useMenuDials. */
  sub?: string;
  /** Purple third line, below sub. */
  note?: string;
  /** Badge asset shown beside the label. */
  badge?: string;
}

export interface NavCategory {
  id: string;
  label: string;
  /** Categories with items are dropdown (desktop) / disclosure (mobile) triggers. */
  items?: NavItem[];
  /** Categories without items are plain links. Only one of items/href is set. */
  href?: string;
}

/* Only "ürünler" has sub-items; the other two are destinations, so on desktop they
   navigate instead of opening a panel, and on mobile they're plain rows. */
export const NAV: NavCategory[] = [
  {
    id: "urunler",
    label: "ürünler",
    items: [
      { label: "hesap", href: "#",
        sub: "paranı bağlamadan her gün faiz kazan" },
      { label: "hesap kartı", href: "/hesap-karti",
        sub: "kartınla harcadıkça <b>%1 nakit iade</b> ve <b>getirpara</b> kazan!" },
      { label: "kredi kartı", href: "#",
        sub: "taksit yapan, kazandıran, aidatsız kredi kartı" },
      { label: "ihtiyaç kredisi", href: "#",
        sub: "hızlı başvuru, uygun faiz ve esnek vade seçenekleri" },
      { label: "mini kredi", href: "#",
        sub: "kolay al, kolay öde" },
      { label: "kasada kredi", href: "#",
        sub: "kasada al, taksitle öde" },
      { label: "avans limit", href: "#",
        sub: "acil ihtiyaçların için yanında" },
      { label: "getirsonraöde", href: "#", badge: "/assets/badges/yeni.svg",
        sub: "getir’deki harcamalarını <b>60 güne kadar</b> <b>%0 faiz</b> ile erteleme imkanı" },
      { label: "döviz işlemleri", href: "#",
        sub: "dar makas ile avantajlı kurlar" },
      { label: "ödemeler", href: "#" },
      { label: "para transferi", href: "#",
        sub: "7/24 ücretsiz havale, EFT, FAST" },
      { label: "ücretsiz atm’ler", href: "#",
        sub: "tüm atm’lerden ücretsiz çekebilirsin",
        note: "Fibabanka ve Akbank’ta ücretsiz" }
    ]
  },
  { id: "kampanyalar", label: "kampanyalar", href: "#" },
  { id: "ucretler", label: "ürün ve hizmet ücretleri", href: "#" }
];

export interface HeroOffer {
  /** May carry inline HTML (rendered via dangerouslySetInnerHTML, same as sub). */
  title: string;
  sub: string;
  /* Legal disclaimer for the rate claim on this slide (Fibabanka legal
     footnote). Shown under the bank line, synced to the active offer; slides
     without a rate claim leave it undefined and the line stays blank. */
  legal?: string;
}

/* Deposit-rate legal — shared by the hero's %44 slide and the Faiz section
   (same claim, same disclaimer required in both places). */
export const FAIZ_LEGAL =
  "belirtilen faiz oranı yıllıktır ve günlük hesap faiz oranı brüttür ve 2.500 TL – 4.500.000 TL bakiyeli hesaplarda alt limitin üstünde kalan tutarlar için geçerlidir";

export const HERO_OFFERS: HeroOffer[] = [
  /* "yıllık" de-emphasized as a small cap above the % — revizyon feedback:
     the annual rate was overpowering the daily-earn message */
  { title: "<small class='hero__title-yr'>yıllık</small>%44 faizle", sub: "paranı bağlamadan<br>her gün iyi kazan",
    legal: FAIZ_LEGAL },
  { title: "iyi faizli kredi",            sub: "aylık %3,49’dan başlayan faizlerle",
    legal: "örnek hesaplama: 100.000 TL için aylık %3,49 faiz oranlı 12 ay vadeli hayat sigortalı kredinin YMO’su %72,2963’tür" },
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
  /* ⚠ near-duplicate of DEBIT_EARN heading below ("harcadıkça getirpara / ve nakit
     iade kazan") — flagged for owner (review feedback 2026-07-24), implemented as given */
  sub: "harcadıkça getirpara ve nakit iade kazan",
  cta: "kart al"
};

/* Three benefits, deliberately NOT peers — `iade` is the broadest promise (all
   physical spend) and leads the bento; getirpara and abonelik are the narrow,
   higher-rate specifics that pair beneath it (owner, 2026-08-03). */
export const DEBIT_EARN = {
  title: "harcadıkça getirpara",
  titleHl: "ve nakit iade kazan",
  /* ⚠ still names only two of the three mechanics — says nothing about
     abonelik nakit iade. Flagged for owner; needs a third clause or a rewrite. */
  sub: "yemekten markete, akaryakıttan alışverişe nakit iade kazanırken; getirmarket ve bitaksi'de getirpara ile kazancını katla",
  /* All three share pre/em/post so the emphasised figure is one span the layout
     colours: yellow on the dark bento tiles, purple on the light v2 tints
     (yellow would be invisible on #fffdf0 / #f9f7ff). */
  iade: { pre: "fiziksel tüm harcamalarına aylık ", em: "₺1.250", post: "'ye kadar anında nakit iade!" },
  getirpara: { pre: "getirmarket ve bitaksi'de yapacağın harcamalara ", em: "%3", post: " getirpara" },
  /* DRAFT, from Figma 22054:45003 — needs owner + legal review. Names three
     third-party services in body copy; the tile carries NO third-party marks
     (owner, 2026-08-03), so the offer rests on this sentence plus a generic
     motif. If legal objects to naming them, "seçili dijital abonelikler"
     alone still stands on its own. */
  abonelik: {
    pre: "spotify, amazon prime, chatgpt ve dahası… seçili dijital aboneliklerde ",
    em: "%20",
    post: " nakit iade"
  }
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
    "her kartın için limitini belirle, bütçeni kontrol et",
    "internet alışverişlerini güvenle yap"
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
export const NEWSLETTER = {
  title: "paranın gündemi",
  titleHl: "getirfinans ekspres'te",
  lead: "kampanyaları, ipuçlarını ve finans gündemini takip et",
  cta: "gazeteyi oku",
  /* CTA target: real newsletter URL pending — placeholder like the other page CTAs */
  href: "#",
  issue: { no: "sayı 01", date: "temmuz 2026" },
  /* Marketing-supplied flat newspaper render — transparent PNG with the drop
     shadow baked in, so it needs no card frame behind it. Replaced the fanned
     page stack (old sayfa-0N@2x.webp assets now unused). */
  image: {
    src: "/assets/newsletter/ekspres-sayi-004.png",
    alt: "getirfinans ekspres gazetesi, sayı 004: kredide indirim",
  },
  imageAspect: "1122 / 1036",
};
