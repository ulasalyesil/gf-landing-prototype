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

/* ===== /hesap-karti (GFDES-2174) ===== */
/* Steps copy is a Turkish draft replacing the English template text —
   needs owner + legal review before lock (esp. anything fee-related). */

/* Every CTA on this page pointed at a bare "#", so the three of them were
   indistinguishable in the DOM and there was nowhere for the frontend developer
   to put a real destination without touching JSX. Each section now carries its
   own `href`, defaulted to this one marker: grep it to find every link still
   needing a target, and it reads as unfinished rather than as a deliberate
   same-page anchor. Replace per section — the two card products do NOT share a
   destination. */
export const DEBIT_CTA_TODO = "#";

/* Delivery-time disclaimer. NOT new copy — this is the exact string the landing
   page already carries under the identical "dakikalar içinde kapında" claim
   (`.debit__legal` in DebitCard.tsx), lifted to a shared constant the way
   FAIZ_LEGAL was, because the same claim now appears on two surfaces and a
   second hand-typed copy is how the two drift apart.
   ⚠ This covers the SPEED claim only. Still unqualified on this page, and each
   one needs a legal-supplied string before launch — I am not writing these:
     · "ücretsiz" (hesap kartı, kurye, para transferi, ATM) ×4
     · the %1 / %3 / %20 nakit iade rates
     · the ₺1.250 monthly ceiling — and whether it is per-mechanic or combined,
       which /kredi-karti currently answers differently (see DEBIT_EARN.iade)
   Add them as `legal` on the owning section; the rendering slot now exists. */
export const DEBIT_DELIVERY_LEGAL =
  "teslimat süresi lokasyona ve operasyonel koşullara göre değişiklik gösterebilir";

export const DEBIT_HERO = {
  badge: "kartın dakikalar içinde kapında",
  title: "geri dönüşü",
  titleHl: "muhteşem kart",
  /* Owner, 2026-08-11 (page feedback round 3). Replaces "harcadıkça getirpara ve
     nakit iade kazan", which was flagged from 2026-07-24 as a near-duplicate of the
     DEBIT_EARN heading below — this wording resolves that: it now leads with the
     free-card promise and a concrete rate instead of restating the earn section.
     ⚠ TYPO CORRECTED: the instruction read "harcakrken"; shipped as "harcarken".
     Say so if that was deliberate.
     ⚠ "%1" — AGENTS.md reserves the % GLYPH for interest/faiz on ICONS; this is
     body copy stating a cashback rate, which the page already does in
     DEBIT_ABROAD.captions ("%1 nakit iade") and DEBIT_EARN.getirpara ("%3"), so it
     is consistent with how the rule has been applied. No % icon is introduced. */
  sub: "ücretsiz hesap kartınla harcarken %1 nakit iade kazan",
  cta: "kart al",
  href: DEBIT_CTA_TODO,
  /* qualifies the badge's "dakikalar içinde" claim — same string the landing
     already shows for it. The "ücretsiz" and "%1" claims in this sub are still
     unqualified; see DEBIT_DELIVERY_LEGAL. */
  legal: DEBIT_DELIVERY_LEGAL
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
  /* Owner, 2026-08-11 (page feedback round 3). Was "spotify, amazon prime, chatgpt
     ve dahası… seçili dijital aboneliklerde %20 nakit iade".
     Two things this changes, both in the right direction on the legal question that
     has been open since 2026-08-03: it drops "chatgpt" (one fewer named third-party
     mark) and replaces "ve dahası… seçili dijital" with the generic category
     "seçili yapay zeka", so the AI half of the offer no longer names anyone.
     ⚠ STILL NAMES TWO MARKS in body copy — spotify and amazon prime. That is
     nominative use, not mark reproduction (the tile still carries NO logos, owner
     2026-08-03, and the marks were refused outright on 2026-08-10), but it is the
     same open legal item, now narrower. "seçili dijital abonelikler" alone still
     stands on its own if legal objects to the remaining two. */
  abonelik: {
    pre: "spotify, amazon prime ve seçili yapay zeka aboneliklerinde ",
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
  /* same product and same destination as the hero, so the repeated label is
     deliberate here — unlike DEBIT_SANAL.cta, which sells the other card */
  cta: "kart al",
  href: DEBIT_CTA_TODO,
  legal: DEBIT_DELIVERY_LEGAL
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
  /* ⚠ COPY CHANGE — needs owner sign-off.
     Was "kart al", byte-identical to the hero's and the teslimat section's CTA.
     All three rendered the same label on the same href, but this one sells a
     DIFFERENT product: :194 above states the model outright ("Sanal kart is a
     distinct product, so it owns a section"), so a reader clicking "kart al"
     here could not tell whether they were re-ordering the physical card or
     creating a virtual one — and three identical label+href pairs cannot be
     told apart in analytics either.
     "oluştur" is not a new word: it is the verb this section's own first
     feature already uses ("ayrı kartlar oluştur"), so the CTA now matches the
     language the section taught the reader two lines earlier. */
  cta: "sanal kart oluştur",
  href: DEBIT_CTA_TODO,
  /* Same {text, icon} shape as DEBIT_ABROAD.captions — the two lists share
     `.dpc-points`, so they share their item shape too.
     Real icons for items 1-2 landed 2026-08-10 (owner-supplied). All are white /
     yellow because this list sits on the DARK .dpc-sanal__row.
     ⚠ Item 3 still carries `placeholder-globe.svg` — kept on the owner's explicit
     instruction ("keep the third one as is"). It happens to read fine, since a
     globe for "internet alışverişleri" says web rather than world, but the FILENAME
     still says placeholder. Rename or replace when the intent is settled.
     ⚠ ORDER deliberately differs from the comp: 22074:14642 reads
     kartlar → internet → limit, this keeps kartlar → limit → internet from the
     review round (2026-07-24), which is newer than the comp. */
  features: [
    { text: "harcamaların için ayrı kartlar oluştur, rahatça takip et", icon: "cards-multi.svg" },
    { text: "her kartın için limitini belirle, bütçeni kontrol et", icon: "card-limit.svg" },
    { text: "internet alışverişlerini güvenle yap", icon: "placeholder-globe.svg" }
  ] as { text: string; icon?: string }[],
  media: "/assets/img/virtual-card.png"
};

/* CMO round 2026-08-05: the ATM-komisyon caption is deleted, and caption 2 is
   reworded to lead with "yurt dışında DA" — the point is "TR'de var, yurt dışında
   da var", so the "da" is load-bearing and not a stylistic choice.
   Captions carry an icon now (faiz-points pattern) — the hard \n is gone, the
   items wrap naturally and the grid equalises them.
   A third, main-benefit item ("harcamalarını TL olarak rahatça öde" or similar) was
   tracked here as COMING FROM PRODUCT — see the caption-1 note below, which as of
   2026-08-11 appears to have absorbed it into caption 1. The list still reads at
   both 2 and 3 items either way.
   ICONS: real set landed 2026-08-10 for 4 of the 5 slots (both here + 2 of the 3
   in DEBIT_SANAL). Only DEBIT_SANAL's third still carries the placeholder globe,
   held there on the owner's instruction. Two colourways, because the two lists sit
   on different panels: white/yellow on the sanal dark, --gf-purple on this lilac.
   The old repo icons were tried for this list and pulled back out: `flag-usd.svg`
   put a US flag on a Turkish bank's page and says "dollar" rather than "good
   rates", and `cashback.svg` is a grey coin at low contrast on the lilac panel.
   The %1 item's icon is a globe and carries NO % glyph, which is what the AGENTS.md
   rule requires (% reserved for faiz); a coin would have been fine too. */
export const DEBIT_ABROAD = {
  /* "yurtdışında" moved down to join the highlighted phrase (owner, 2026-08-10:
     "should go in the second line in the same line as yapılacaklar listesi and the
     border should cover all three"), so line 1 is "hesap kartınla" and the yellow
     bar runs under all three words of line 2.
     ⚠ The bar is ONE absolutely-positioned box (`.hl::after`, width 100% of an
     inline-block), so it only reads correctly while the phrase stays on a single
     line. Lengthening it from 20 to 31 characters lowers the width at which it
     wraps — see the `.dpc-abroad__title` rules for the guard. */
  title: "hesap kartınla",
  titleHl: "yurtdışında yapılacaklar listesi",
  /* Real icons landed 2026-08-10 (owner-supplied), replacing the placeholder globes
     from earlier the same day. Both are --gf-purple, matching this list's text —
     the panel is the LILAC tint, not the sanal dark, so these are the purple
     counterparts of DEBIT_SANAL.features' white set.
     Neither carries a % glyph, which AGENTS.md requires: % is reserved for
     interest/faiz and the "%1" here is cashback.
     WORDING, caption 1 (owner, 2026-08-11): now "harcamalarını avantajlı kurlarla
     TL olarak rahatça öde", which IS Figma 22200:16954's own wording — so this
     caption no longer diverges from the comp.
     ⚠ This probably ABSORBS the third item rather than waiting for it. The note
     above has tracked a pending "main-benefit" caption from product worded roughly
     "harcamalarını TL olarak rahatça öde"; the new caption 1 merges exactly that
     point into the FX-rate one. Treat the list as complete at 2 unless product says
     otherwise — and if a third does still land, nothing needs building: the row is
     driven by item count, so adding a record adds a card.
     ⚠ WORDING, caption 2: the comp reads "yurt dışında harcarken de %1…"; this
     still keeps "yurt dışında da harcarken %1…" from the CMO round (2026-08-05),
     where the "da" placement was called out as load-bearing ("TR'de var, yurt
     dışında DA var"). Deliberately not followed.
     No hard "\n" in either caption, per the note above: the comp draws caption 1 as
     two lines, but the cards wrap naturally and `.dpc-point p` carries
     `text-wrap: balance`, so a manual break would fight the balancer and would be
     wrong at any width but one. */
  captions: [
    { text: "harcamalarını avantajlı kurlarla TL olarak rahatça öde", icon: "exchange-purple.svg" },
    { text: "yurt dışında da harcarken %1 nakit iade kazan", icon: "world-purple.svg" }
  ] as { text: string; icon?: string }[]
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

/* ===== Kredi kartı (GFDES-2243) =====
   First draft, 2026-08-19. Every product fact below is lifted from the LIVE
   page (getirfinans.com/kartlar/kredi-karti) — nothing here is invented. What
   changed is the ORDER: the live page makes three co-equal promises (aidatsız
   + taksit + getirpara) in one headline, and this draft leads with `aidatsız`
   because it is the only one of the three exclusive to this card. Taksit is a
   Maximum-network feature (shared) and getirpara is already /hesap-karti's lead
   story, so repeating it here blurs the two cards.
   ⚠ That reordering is a proposal, not a settled call — it changes what the
   page argues, so it needs Aycan and product before it ships. */
export const CREDIT_HERO = {
  /* True for this card and a real GF differentiator (Getir courier delivery).
     Live page carries it as a section headline; promoted to the badge here. */
  badge: "kartın dakikalar içinde kapında",
  title: "aidatsız",
  titleHl: "kredi kartı",
  /* Measured at 1280: the first draft of this line ran 5 lines at 30.7px inside
     the 460px column, which made it read as a paragraph competing with the
     64px title rather than a subhead under it. Cut to one sentence — three
     verbs, one rhythm. The specifics it used to carry (Maximum, %3, ₺1.250)
     belong in the avantajlar section, which states them properly. */
  sub: "aidat ödemeden harca, taksitle, getirpara kazan.",
  cta: "kart al",
};

/* Three benefits, deliberately NOT peers — same grid shape as DEBIT_EARN (lead
   row full width, two beneath), because the sibling page proved it and a second
   product page should not invent a second layout for the same job.
   The lead tile is the one thing that differs: it is an EKSTRE row rather than a
   copy block. See credit.css for why. */
export const CREDIT_AVANTAJ = {
  title: "kredi kartı",
  titleHl: "avantajları",
  sub: "aidat yok, taksit var, harcadıkça getirpara kazanıyorsun.",
  /* The signature. A Turkish credit card is known by its yıllık kart aidatı —
     the line that shows up on every ekstre. This states the claim in the exact
     format where it is normally disproven. No competitor is named and no
     competitor figure is shown: comparative claims against named banks are a
     legal problem, and GF is never framed against anyone (AGENTS.md). */
  aidat: {
    label: "ekstre",
    row: "yıllık kart aidatı",
    amount: "₺0",
    /* no em dash: GF product copy is plain and lowercase, and a dash here reads
       as a marketing beat the rest of the page doesn't use */
    note: "ne ilk yıl, ne sonrasında. kart aidatı diye bir şey yok.",
  },
  taksit: {
    pre: "İş Bankası Maximum üye iş yerlerinde ",
    em: "taksit",
    post: " fırsatları",
  },
  /* ⚠ "%3" — AGENTS.md reserves the % GLYPH for interest/faiz on ICONS. This is
     body copy stating a cashback rate, which the live page and DEBIT_EARN both
     already do. No % icon is introduced; the tile pairs with a coin if it ever
     gets one. */
  getirpara: {
    pre: "getirmarket ve bitaksi'de ",
    em: "%3",
    post: " getirpara",
    note: "kredi kartı ve hesap kartınla her ay toplam ₺1.250'ye kadar kazanabilirsin",
  },
};

export const CREDIT_TAKSIT = {
  title: "ücretsiz",
  titleHl: "3 taksit",
  sub: "seçili sektörlerde harcamanı peşin yap, uygulamada sonradan taksitle.",
  /* Fixes a live-page defect: the raw URL `https://www.maximum.com.tr/kampanyalar`
     is currently rendered as its own link text. Same destination, labelled. */
  link: { label: "maximum kampanyalarına göz at", href: "https://www.maximum.com.tr/kampanyalar" },
};

/* The trust/objection block neither card page has today. /hesap-karti has been
   missing Trust + FAQ since the 2026-07-03 review; a credit card is the
   higher-commitment product, so it is the better place to build it first and
   port back rather than inherit the omission.
   ⚠ Every answer is paraphrased from live-page copy — no product fact is
   invented — but FAQ copy still needs product sign-off before it ships. */
export const CREDIT_SSS = {
  title: "sık sorulan",
  titleHl: "sorular",
  items: [
    {
      q: "kredi kartının yıllık aidatı var mı?",
      a: "yok. getirfinans kredi kartında yıllık kart aidatı alınmıyor.",
    },
    {
      q: "nasıl başvurabilirim?",
      a: "önce getirfinanslı olman gerekiyor. sonrasında uygulamadan kredi kartına başvurup limitini anında öğrenebilirsin.",
    },
    {
      q: "kart ne zaman elime geçer?",
      a: "başvurun onaylandıktan sonra kartın istediğin adrese dakikalar içinde gelir.",
    },
    {
      q: "taksit hangi iş yerlerinde geçerli?",
      a: "İş Bankası Maximum üye iş yerlerinde taksitli alışveriş yapabilirsin.",
    },
    {
      q: "getirpara nasıl kazanıyorum?",
      a: "getirmarket ve bitaksi harcamalarında %3 getirpara kazanırsın. kredi kartı ve hesap kartınla birlikte her ay toplam ₺1.250'ye kadar kazanabilirsin.",
    },
  ],
};
