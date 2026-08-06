/* Created by Claude — INTERNAL
   GFDES-2175 — provisional paranaiyibak.com chrome.

   PROVISIONAL, deliberately minimal. paranaiyibak.com has no page in this repo,
   so there is no PİB header/footer to reuse — and the getirfinans.com `Header`
   would put GF's product nav on a campaign-brand page, which is the wrong
   brand, not just the wrong layout.

   So this is the smallest honest shell: the existing PİB wordmark asset
   (`/assets/logos/paranaiyibak.svg`, the yellow pill — PİB's accent is GF
   yellow, so nothing new is invented) plus a single link back to the
   dictionary, and a footer hairline. Replace wholesale the moment real PİB
   chrome exists; nothing else depends on these class names. */

import Link from "next/link";

export function PnibHeader() {
  return (
    <header className="pnib-chrome">
      <div className="pnib-container pnib-chrome__inner">
        <Link href="/pnib" className="pnib-chrome__mark" aria-label="paranaiyibak ana sayfa">
          {/* Fixed intrinsic size; the asset is 160×32 and must not be scaled
              by the cascade — it is a wordmark, not an illustration. */}
          <img src="/assets/logos/paranaiyibak.svg" alt="paranaiyibak" width={160} height={32} />
        </Link>
        <nav className="pnib-chrome__nav" aria-label="site">
          <Link href="/pnib/sozluk" className="pnib-chrome__link">
            sözlük
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function PnibFooter() {
  return (
    <footer className="pnib-foot">
      <div className="pnib-container pnib-foot__inner">
        <p className="pnib-foot__note">
          paranaiyibak, getirfinans’ın finansal okuryazarlık girişimidir.
        </p>
      </div>
    </footer>
  );
}
