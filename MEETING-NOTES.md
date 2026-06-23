# Meeting notes & revisions — 2026-06-23

Captured from review meeting. **Not yet built.** Mobile Figma still incoming.

---

## Status flags
- 🔴 **Mobile** — antigravity's mobile pass got a *no-pass* in the meeting. Likely **revert** the current mobile work and rethink once the mobile Figma lands. Direction: feature cards can stack on top of each other; everything legible in one screen with less scrolling; animation-driven.
- 🟡 Several desktop items need design exploration before building (FX cards, hero offer-in-text).
- ⚪ One item belongs to brand/marketing, not design.

---

## Desktop feedback

1. **Keep both bars (top + bottom).** Keep the stats section, and also bring back the `1.000.000+` badge (the hero stat badge). → stats stays **and** the 1M+ badge returns.
2. **FX rate cards — redesign.** Remove the average/mid rate; push **al / sat** (buy/sell) to the front. Needs visual-design research on how the card reads without the headline price. 🟡
3. **"daha iyi kredi var mı?" copy** — to be reviewed; we look high vs. the market. Owned by **brand & marketing**, not design. ⚪
4. **Hero banner — bake the offer into the text.** e.g. a huge **%44** with supporting copy underneath (offer-as-typography). 🟡 → ties into the hero title/subtitle flip below.
5. **Moped animates along the yellow line.** Under the "anında kapıda" message (debit section), the moped (`courier.svg`) should travel along the yellow underline.
6. **Keep "ışıkları kapattık"** — proceed with the dark-mode section.
7. **Remove "getirfinans kendi uygulamasında."** Drop the footer CTA block at the very bottom ("getirfinans artık kendi uygulamasında").

---

## Hero — flip title **and** subtitle (4 pairs)

Replace the static "ama ne finans!" + single flipping sub. Hero now cycles through 4 offer pairs (bold title line = the offer, subtitle = support). Synced to the video.

```
yıllık %44 faizle
paranı bağlamadan her gün iyi kazan

uygun oranlı kredi
aylık %3,49'dan başlayan faizlerle

çok iyi kurlar
hafta içi akşamları bile dar makasla işlem yap

%1 nakit iadeli hesap kartı
kartın dakikalar içinde kapında, harcarken geri kazan.
```

---

## Highlights / stats section content

**Section title:** her gün daha fazla getirfinanslı

| Stat | Label |
|---|---|
| 1.000.000+ | getirfinanslı |
| 4 getirfinanslı'dan 1'i | arkadaş tavsiyesiyle geliyor *(if it fits)* |
| Türkiye'nin ilk | servis bankacılığı deneyimi |

---

## Mobile (do NOT build yet — Figma pending)

- Current mobile implementation rejected. Plan to revert.
- Problem: images too big, too much scrolling. Want each feature clearly visible, ideally one feature per screen view.
- Idea raised: feature cards stacking on top of each other.
- Animation to be worked on.
- Wait for the mobile Figma before rebuilding.
