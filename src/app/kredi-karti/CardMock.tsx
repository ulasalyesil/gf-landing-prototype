/* PLACEHOLDER — CSS-drawn credit card, not the product render.

   There is no credit card asset in the repo: `debit-card-render.png` /
   `debit-card.mp4` are the debit card, and `kredi-*.png` are photos for the
   LOAN sections on the landing page (kredi = loan, kredi kartı = credit card —
   different products, easy to grab by mistake).

   Drawn in CSS rather than pointing an <img> at a missing file so the draft
   renders honestly instead of shipping a broken-image box. The debit page did
   the same in its first pass ("card visual is a CSS mock until
   assets/img/debit-hero-card.png is supplied").

   Replace wholesale once marketing supplies the render — do not iterate on
   this. No Mastercard or Maximum mark is drawn: those are third-party marks and
   the debit page already has an open legal item about exactly that on a public
   URL. */

export default function CardMock() {
  return (
    <div className="ckp-cardmock" role="img" aria-label="getirfinans kredi kartı görseli (yer tutucu)">
      <div className="ckp-cardmock__sheen" aria-hidden="true" />
      <span className="ckp-cardmock__chip" aria-hidden="true" />
      <span className="ckp-cardmock__brand">getirfinans</span>
      <span className="ckp-cardmock__flag" aria-hidden="true">
        yer tutucu
      </span>
    </div>
  );
}
