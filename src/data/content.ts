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
      { label: "kredi kartı", href: "/kredi-karti",
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
  /* Order is locked to the hero video's four beats (hesap → kredi → fx →
     hesap kartı; owner, 2026-08-20) — reordering here desyncs the copy from
     the footage, since Hero.tsx maps array position straight onto the video's
     5s segments. */
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

/* One beat of the hero video. The footage is 20s with four 5s segments, so
   this is the segment length, not a free choice — Hero.tsx derives the active
   slide from the video's own currentTime so the copy can't drift from it. */
export const HERO_FLIP_MS = 5000;

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

/* ===== Card pages v2 — shared (/kredi-karti + /hesap-karti) =====
   Created by Claude · INTERNAL
   Rebuilt 2026-09-23 from Figma `v2` (22630:19402): credit 22630:12072,
   debit 22630:16190. Copy below is the comps' VERBATIM, including the
   parts that are clearly wrong or placeholder — this pass builds the static
   designs so their issues can be judged on a real page. Every such line is
   marked ⚠ COMP; the full list is in TODO.md. */

/* Every CTA on these pages pointed at a bare "#", so they were
   indistinguishable in the DOM and there was nowhere for the frontend developer
   to put a real destination without touching JSX. Each section carries its own
   `href`, defaulted to this one marker: grep it to find every link still
   needing a target. Replace per section — the two card products, and the
   physical and virtual debit card, do NOT share a destination. */
export const CTA_TODO = "#";

/* Delivery-time disclaimer. NOT new copy — this is the exact string the landing
   page already carries under the identical "dakikalar içinde kapında" claim
   (`.debit__legal` in DebitCard.tsx). Both card heroes now carry that claim in
   their badge, so both render it; the v2 comps show no legal line at all.
   ⚠ This covers the SPEED claim only. Still unqualified, and each needs a
   legal-supplied string before launch: "ücretsiz" (kurye, taksit), the
   %1 / %3 / %20 nakit iade rates, ₺350, and the ₺1.250 monthly ceiling. */
export const CARD_DELIVERY_LEGAL =
  "teslimat süresi lokasyona ve operasyonel koşullara göre değişiklik gösterebilir";

/* Figma "Breadcrumb" 22630:15278. ⚠ No page exists behind any of these yet;
   "kartlar" is the section both card pages belong to (aria-current). */
export const PRODUCT_SUBNAV = {
  label: "ürünler",
  items: [
    { id: "hesap", label: "hesap", href: "#" },
    { id: "kartlar", label: "kartlar", href: "#" },
    { id: "kredi", label: "kredi", href: "#" },
    { id: "avans", label: "avans limit", href: "#" },
    { id: "getirsonraode", label: "getirsonraöde", href: "#" },
    { id: "transfer", label: "para transferi", href: "#" },
    { id: "doviz", label: "döviz işlemleri", href: "#" },
    { id: "odemeler", label: "ödemeler", href: "#" },
  ],
};

export interface FaqEntry {
  q: string;
  a: string;
}

/* ===== /hesap-karti (GFDES-2174) — v2 ===== */

export const DEBIT_HERO = {
  badge: "dakikalar içinde kapında",
  /* one array per line; "@key" = an inline icon the page supplies */
  title: [["geri dönüşü", "@calendar"], ["muhteşem kart", "@card"]],
  /* ⚠ COMP: "Maximum" is the credit card's program — this sub is the credit
     hero's, copied. The owner-approved debit sub (2026-08-11) was
     "ücretsiz hesap kartınla harcarken %1 nakit iade kazan". */
  sub: { muted: "Maximum kart’ınızla alışveriş yapın, ", em: "getir’de geçerli ₺350 kazanın!" },
  cta: "karta başvur",
  href: CTA_TODO,
  legal: CARD_DELIVERY_LEGAL,
  media: { src: "/assets/img/hesap-karti/hero.jpg", width: 2048, height: 1152 },
};

export const DEBIT_BENEFITS = {
  eyebrow: "getirfinans hesap kartı",
  title: "kart avantajları",
  /* ⚠ COMP: says "kredi kartı" on the debit page */
  sub: "Her harcamanızda kazandıran kredi kartı ayrıcalıkları ve fırsatlarıyla tanışın.",
  getirpara: {
    title: "getirmarket ve bitaksi’de yapacağın harcamalara %3 getirpara",
    /* wallet widget inside the phone */
    wallet: {
      label: "güncel",
      brand: "getirpara",
      amount: { cur: "₺", int: "45", dec: ",00" },
      cap: { cur: "₺", int: "1.250", dec: ",00", unit: "/ aylık" },
      totalLabel: "toplam kazancın",
      total: "₺8.501,00",
      progress: 0.3444,
    },
  },
  /* ⚠ COMP: Amazon and Spotify marks are drawn in this tile. Legal refused
     third-party marks on the abonelik tile on 2026-08-10. */
  abonelik: {
    title: "spotify, amazon ve dahası… seçili dijital aboneliklerde %20 nakit iade",
    notification: {
      app: "getirfinans",
      time: "15:08",
      body: "hesap kartınla yaptığın harcamandan kazandığın nakit iade hesabında!",
    },
  },
  /* ⚠ COMP: "₺1250" — the rest of the site writes "₺1.250" */
  iade: { title: "fiziksel tüm harcamalarına aylık ₺1250’ye kadar anında nakit iade!" },
};

/* Delivery — the scroll-scrubbed section. Steps drive the list on the right
   and the tracking card's stepper on the left together. */
export const DEBIT_DELIVERY = {
  eyebrow: "GETİR HESAP KARTI",
  title: "hızlı kart teslimatı",
  sub: "kartın dakikalar içinde kapında",
  steps: [
    {
      title: "ücretsiz kurye teslim etsin",
      desc: "Kuryemiz, yeni kartınızı dakikalar içinde doğrudan adresinize güvenle teslim etsin.",
    },
    /* ⚠ COMP: step 02 repeats step 01's title and has no description */
    { title: "ücretsiz kurye teslim etsin", desc: "" },
    { title: "kazanmaya başla", desc: "" },
  ],
  cta: "detaylı bilgi",
  href: CTA_TODO,
  tracking: {
    status: "yolda",
    eta: "tvs 15-20 dk.",
    addressLabel: "Ev;",
    address: "Etiler Mah. Tanburi Ali Efendi Sok. Maya Residences Sit. T Blok No:13/334 Beşiktaş İstanbul",
    stages: ["hazırlanıyor", "yolda", "kapıda", "teslim edildi"],
    faq: "kurye ziyaretinde seni neler bekliyor?",
  },
};

export const DEBIT_SANAL = {
  id: "sanal-kart",
  eyebrow: "getirfinans hesap kartı",
  title: "sanal hesap kartıyla güvenle harca",
  /* ⚠ COMP: placeholder sub */
  sub: "Buraya bir cümle description gelecek",
  /* comp order (kartlar → internet → limit) */
  features: [
    "harcamaların için ayrı kartlar oluştur, rahatça takip et",
    "internet alışverişlerini güvenle yap",
    "her kartın için limitini belirle, bütçeni kontrol et",
  ],
  cta: "sanal karta başvur",
  href: CTA_TODO,
};

export const DEBIT_ABROAD = {
  eyebrow: "getirfinans hesap kartı",
  /* ⚠ COMP: same title as DEBIT_BENEFITS, and the same "kredi kartı" sub */
  title: "kart avantajları",
  sub: "Her harcamanızda kazandıran kredi kartı ayrıcalıkları ve fırsatlarıyla tanışın.",
  /* comp wording "harcarken de"; the CMO round (2026-08-05) had "da harcarken" */
  cashback: "yurt dışında harcarken de %1 nakit iade kazan",
  fx: "harcamalarını avantajlı kurlarla TL olarak rahatça öde",
};

/* ⚠ COMP: these answers are about a daily-interest ACCOUNT ("günlük faiz"),
   not the card. Used verbatim on the debit page pending real card FAQ copy. */
export const DEBIT_FAQ: { title: string; items: FaqEntry[] } = {
  title: "sıkça sorulan sorular",
  items: [
    { q: "günlük faiz kazandıran hesap nedir?", a: "Günlük faiz kazandıran hesap, paranızın her gün faiz getirisi sağladığı bir tasarruf hesabıdır." },
    { q: "günlük faiz hesabı açmak için ne gerekir?", a: "Günlük faiz hesabı açmak için kimlik belgesi ve banka hesabınızın olması yeterlidir. Günlük faiz hesabı açmak için kimlik belgesi ve banka hesabınızın olması yeterlidir. a Günlük faiz hesabı açmak için kimlik belgesi ve banka hesabınızın olması yeterlidir. a" },
    { q: "günlük faiz oranları nasıl belirlenir?", a: "Günlük faiz oranları piyasa koşulları ve ekonomik gelişmelere göre bankalar tarafından belirlenir." },
    { q: "faiz kazancım ne zaman hesabıma yansır?", a: "Faiz kazancınız genellikle her gün hesabınıza yansır ve anlık olarak birikir." },
    { q: "günlük faiz hesabının vadeli mevduattan farkı nedir?", a: "Günlük faiz hesabı, faiz getirisi günlük hesaplanırken, vadeli mevduat faiz oranı vade boyunca sabittir." },
  ],
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

/* ===== /kredi-karti (GFDES-2243) — v2 ===== */

export const CREDIT_HERO = {
  badge: "dakikalar içinde kapında",
  /* one array per line; "@key" = an inline icon the page supplies */
  title: [["taksit yapan", "@calendar", "kazandıran", "@chart"], ["aidatsız kredi kartı", "@card"]],
  sub: { muted: "Maximum kart’ınızla alışveriş yapın, ", em: "getir’de geçerli ₺350 kazanın!" },
  cta: "karta başvur",
  href: CTA_TODO,
  legal: CARD_DELIVERY_LEGAL,
  /* ⚠ COMP asset is 1024×480 for a 1298×607 slot (0.79× at 1x) */
  media: { src: "/assets/img/kredi-karti/hero.webp", width: 1024, height: 480 },
};

export const CREDIT_BENEFITS = {
  eyebrow: "GETİR KREDİ KARTI",
  title: "kart avantajları",
  sub: "Her harcamanızda kazandıran kredi kartı ayrıcalıkları ve fırsatlarıyla tanışın.",
  maximum: {
    title: "maximum taksit ayrıcalığı",
    /* ⚠ COMP: "size özel" sits close to the "kampanyalı, never sana özel" rule */
    desc: "Maximum üye iş yerlerindeki alışverişlerinizi, size özel esnek taksit seçenekleriyle bütçenizi yormadan ödeyin",
    rows: ["+1 taksit", "+2 taksit", "+3 taksit"],
  },
  getirpara: {
    title: "ilk harcamana ₺350 getirpara",
    txn: { month: "mayıs", day: "24", merchant: "Ikea Bayrampaşa", amount: { cur: "₺", int: "379", dec: ",00" } },
    reward: "₺350",
  },
  /* ⚠ COMP: Title Case */
  aidat: { title: "Kart Aidatı Yok" },
  /* ⚠ COMP: the photo's card is printed "debit" */
  kampanya: {
    title: "yıl boyu değişen Getirpara kampanyaları",
    desc: "GetirFinans ayrıcalığıyla yılın 365 günü devam eden Getirpara kampanyalarını keşfedin; her harcamanızda anında nakit kazanmanın keyfini yaşayın.",
  },
};

/* Taksit categories. The comp draws one category's large photo (eğitim);
   the others reuse their thumbnail's source photo at full size. */
export const CREDIT_TAKSIT = {
  eyebrow: "TAKSİT AVANTAJI",
  title: "ücretsiz 3 taksit",
  sub: "seçili sektörlerde harcamanı peşin yap, uygulamada sonradan taksitle",
  /* ⚠ COMP: every category carries the eğitim description */
  categories: [
    { id: "egitim", label: "eğitimde", img: "/assets/img/kredi-karti/taksit-egitim.webp", thumb: "/assets/img/kredi-karti/taksit-egitim-thumb.jpg" },
    { id: "veteriner", label: "veterinerde", img: "/assets/img/kredi-karti/taksit-veteriner.jpg", thumb: "/assets/img/kredi-karti/taksit-veteriner-thumb.jpg" },
    { id: "dis-hekimi", label: "diş hekiminde", img: "/assets/img/kredi-karti/taksit-dis-hekimi.jpg", thumb: "/assets/img/kredi-karti/taksit-dis-hekimi-thumb.jpg" },
    { id: "eczane", label: "eczanede", img: "/assets/img/kredi-karti/taksit-eczane.jpg", thumb: "/assets/img/kredi-karti/taksit-eczane-thumb.jpg" },
    { id: "hastane", label: "hastanede", img: "/assets/img/kredi-karti/taksit-hastane.jpg", thumb: "/assets/img/kredi-karti/taksit-hastane-thumb.jpg" },
  ].map((c) => ({
    ...c,
    desc: "Maximum anlaşmalı üye iş yerlerinden yapacağınız taksitli alışverişlerde hem bütçenizi kolayca yönetin.",
  })),
};

const CAMPAIGN_GETIR = {
  title: ["Getir’de", "%1 getirpara"],
  /* ⚠ COMP: an IKEA/Maximum taksit text under a getirpara headline */
  desc: "5 Ocak - 31 Aralık 2026 tarihleri arasında Maximum Kart ile IKEA  Aile üyelerine 20.000 TL ve üzeri alışverişlerde peşin fiyatına 9 taksit fırsatı!",
  img: "/assets/img/kredi-karti/campaign-getir.jpg",
  href: CTA_TODO,
};

export const CREDIT_CAMPAIGNS = {
  title: "kampanyalar",
  sub: { em: "getirpara", rest: " kazan, getir, bitaksi ve n11’de harca" },
  /* ⚠ PLACEHOLDER: the comp draws 1 of 4 slides; slides 2–4 repeat it */
  slides: [0, 1, 2, 3].map((i) => ({ ...CAMPAIGN_GETIR, id: `getir-${i}` })),
};

export const CREDIT_BRANDS = {
  title: "taksit",
  sub: "Tüm kampanyalarla ilgili detaylı bilgi almak için;",
  cta: "Detaylı bilgi",
  href: "https://www.maximum.com.tr/kampanyalar",
  linkLabel: "kampanya detayı",
  /* ⚠ COMP: only Beymen has detail copy, and it is the IKEA text; the other
     brands repeat it with their own name. Logo boxes are the comp's. */
  brands: [
    { id: "ikea", name: "IKEA", logo: "/assets/img/kredi-karti/brand-ikea.svg", w: 80, h: 32 },
    { id: "decathlon", name: "Decathlon", logo: "/assets/img/kredi-karti/brand-decathlon.svg", w: 138.115, h: 27 },
    { id: "adl", name: "adL", logo: "/assets/img/kredi-karti/brand-adl.png", w: 52, h: 26 },
    { id: "beymen", name: "Beymen", logo: "/assets/img/kredi-karti/brand-beymen.png", w: 105, h: 14, crop: { w: "110.62%", h: "820.47%", l: "-5.31%", t: "-360.63%" } },
    { id: "etstur", name: "etstur", logo: "/assets/img/kredi-karti/brand-etstur.png", w: 93, h: 15 },
    { id: "n11", name: "n11", logo: "/assets/img/kredi-karti/brand-n11.png", w: 67, h: 22, crop: { w: "121.44%", h: "207.95%", l: "-10.53%", t: "-53.98%" } },
  ].map((b) => ({
    ...b,
    offer: "3 taksit",
    desc: "5 Ocak - 31 Aralık 2026 tarihleri arasında Maximum Kart ile IKEA  Aile üyelerine 20.000 TL ve üzeri alışverişlerde peşin fiyatına 9 taksit fırsatı!",
    photo: "/assets/img/kredi-karti/brand-beymen-photo.jpg",
    href: "https://www.maximum.com.tr/kampanyalar",
  })),
  initial: 3,
};

/* FAQ: the comp's copy is the "günlük faiz" account placeholder (same as
   DEBIT_FAQ). These are the first draft's card answers, paraphrased from the
   live page, kept because they are about this product.
   ⚠ FAQ copy still needs product sign-off before it ships. */
export const CREDIT_FAQ: { title: string; items: FaqEntry[] } = {
  title: "sıkça sorulan sorular",
  items: [
    { q: "kredi kartının yıllık aidatı var mı?", a: "yok. getirfinans kredi kartında yıllık kart aidatı alınmıyor." },
    { q: "nasıl başvurabilirim?", a: "önce getirfinanslı olman gerekiyor. sonrasında uygulamadan kredi kartına başvurup limitini anında öğrenebilirsin." },
    { q: "kart ne zaman elime geçer?", a: "başvurun onaylandıktan sonra kartın istediğin adrese dakikalar içinde gelir." },
    { q: "taksit hangi iş yerlerinde geçerli?", a: "İş Bankası Maximum üye iş yerlerinde taksitli alışveriş yapabilirsin." },
    { q: "getirpara nasıl kazanıyorum?", a: "getirmarket ve bitaksi harcamalarında %3 getirpara kazanırsın. kredi kartı ve hesap kartınla birlikte her ay toplam ₺1.250'ye kadar kazanabilirsin." },
  ],
};
