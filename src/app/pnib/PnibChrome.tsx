/* Created by Claude — INTERNAL
   GFDES-2175 — paranaiyibak.com chrome.

   Rebuilt 2026-08-06 against the LIVE site (www.getirfinans.com/parana-iyi-bak/)
   and the Figma `Development — Website` branch, which agree: header frame
   1728x80 with content at 1452, footer frame 1728x591. Every value below was
   measured off the rendered page, not eyeballed off a screenshot — see the
   header/footer notes in pnib.css for the numbers.

   Two things the first pass got wrong, both corrected here:

   1. The header wordmark is PURPLE TEXT, not the yellow pill. The pill is the
      dark-surface treatment and appears in the FOOTER. So the header uses
      paranaiyibak-wordmark.svg (derived from the pill asset by dropping its one
      #FFD300 path) and the footer keeps paranaiyibak.svg.

   2. The header carries two things this shell was missing entirely: the
      `getirfinans.com'a git` text link and the solid purple `getirfinanslı ol`
      pill. Without them the page reads as a documentation site.

   The GF `Header` component is still deliberately NOT reused — it would put GF
   product nav and the mega dropdown on a campaign-brand page. This is PİB's own
   chrome, which is what the live site has too. */

import Link from "next/link";

export function PnibHeader() {
  return (
    <header className="pnib-chrome">
      <div className="pnib-container pnib-chrome__inner">
        <div className="pnib-chrome__lead">
          <Link href="/pnib" className="pnib-chrome__mark" aria-label="paranaiyibak ana sayfa">
            {/* Fixed intrinsic size — a wordmark, not an illustration, and the
                live site renders it 161x22 at EVERY width (it does not scale
                down on mobile). */}
            <img
              src="/assets/logos/paranaiyibak-wordmark.svg"
              alt="paranaiyibak"
              width={161}
              height={22}
            />
          </Link>
          {/* Decorative 1px rule between the mark and the link. aria-hidden and
              empty: it is a separator, and the live site hides it below sm. */}
          <span className="pnib-chrome__rule" aria-hidden="true" />
          {/* In this repo `/` IS getirfinans.com, so the cross-site link is an
              internal route. */}
          <Link href="/" className="pnib-chrome__out">
            getirfinans.com&rsquo;a git
          </Link>
        </div>
        {/* href="#" matches every other CTA in this repo (Header.tsx, Hero.tsx,
            NEWSLETTER.href) — the real signup destination is a standing gap, not
            one introduced here. */}
        <a href="#" className="pnib-chrome__cta">
          getirfinanslı ol
        </a>
      </div>
    </header>
  );
}

export function PnibFooter() {
  return (
    <footer className="pnib-foot">
      <div className="pnib-container pnib-foot__inner">
        <div className="pnib-foot__marks">
          <Link href="/pnib" className="pnib-foot__mark" aria-label="paranaiyibak ana sayfa">
            {/* The PILL asset — correct on the dark panel, and the wordmark
                inside it is already purple-on-yellow. */}
            <img src="/assets/logos/paranaiyibak.svg" alt="paranaiyibak" width={160} height={32} />
          </Link>
          <Link href="/" className="pnib-foot__gf" aria-label="getirfinans">
            {/* The white variant. Both variants already ship in this repo. */}
            <img src="/assets/logos/getirfinans-dark.svg" alt="getirfinans" width={167} height={32} />
          </Link>
        </div>

        {/* Same legal row as the GF footer (Footer.tsx) and the PİB comp. The
            live PİB page currently renders the shorter "© 2026 getir"; keeping
            the full string so the two footers in this repo can't disagree. */}
        <div className="pnib-foot__legal">
          <span>© 2026 getirfinans · bilgi toplumu hizmetleri</span>
          <span className="pnib-foot__fiba">
            bankacılık hizmeti{" "}
            <img src="/assets/logos/fibabanka-logo.svg" alt="Fibabanka" width={150} height={32} />{" "}
            tarafından verilmektedir
          </span>
        </div>
      </div>
    </footer>
  );
}
