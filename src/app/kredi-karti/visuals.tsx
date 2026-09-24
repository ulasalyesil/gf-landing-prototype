/* Created by Claude · INTERNAL */
import { CREDIT_BENEFITS } from "@/data/content";

/* Bento tile illustrations for /kredi-karti (Figma 22630:15619). Rebuilt from
   the comp's layers rather than flattened, so each piece can animate later.
   Geometry is comp px through `--u` (see `.dpc-tile__visual`, product-page.css);
   every visual is decorative — BenefitTile hides it from assistive tech. */

const A = "/assets/img/kredi-karti";

/** Hand holding the card → maximum pill → +1/+2/+3 taksit rows. */
export function MaximumVisual() {
  const { rows } = CREDIT_BENEFITS.maximum;
  return (
    <div className="ckp-max">
      {/* the art is drawn upright and turned −90° in the comp */}
      <div className="ckp-max__hand">
        <div className="ckp-max__hand-rot">
          <img loading="lazy" src={`${A}/benefit-hand.webp`} alt="" width={900} height={1200} />
        </div>
      </div>
      <div className="ckp-max__chain">
        <img loading="lazy" className="ckp-max__dots" src={`${A}/connector-v.svg`} alt="" width={13} height={1} />
        <img loading="lazy" className="ckp-max__logo" src={`${A}/maximum-pill.svg`} alt="" width={212} height={66.9474} />
        <img loading="lazy" className="ckp-max__dots" src={`${A}/connector-v.svg`} alt="" width={13} height={1} />
        <ul className="ckp-max__rows">
          {rows.map((r) => (
            <li key={r}>
              <img loading="lazy" src={`${A}/plus-green.svg`} alt="" width={7.79716} height={8} />
              <span>{r}</span>
              <img loading="lazy" src={`${A}/plus-green.svg`} alt="" width={7.79716} height={8} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Statement row → ₺350 coin, bracketed, with sparkles. */
export function TransactionVisual() {
  const { txn, reward } = CREDIT_BENEFITS.getirpara;
  return (
    <div className="ckp-txn">
      <img loading="lazy" className="ckp-txn__bracket ckp-txn__bracket--l" src={`${A}/bracket-left.svg`} alt="" width={120.5} height={109} />
      <img loading="lazy" className="ckp-txn__bracket ckp-txn__bracket--r" src={`${A}/bracket-right.svg`} alt="" width={120.5} height={109} />
      <div className="ckp-txn__row">
        <span className="ckp-txn__date">
          <span className="ckp-txn__month">{txn.month}</span>
          <span className="ckp-txn__day">{txn.day}</span>
        </span>
        <span className="ckp-txn__merchant">{txn.merchant}</span>
        <span className="ckp-txn__amount">
          <small>{txn.amount.cur}</small>
          {txn.amount.int}
          <small>{txn.amount.dec}</small>
        </span>
      </div>
      <span className="ckp-txn__coin">{reward}</span>
      <img loading="lazy" className="ckp-txn__spark ckp-txn__spark--a" src={`${A}/sparkle-a.svg`} alt="" width={13} height={13} />
      <img loading="lazy" className="ckp-txn__spark ckp-txn__spark--b" src={`${A}/sparkle-b.svg`} alt="" width={17} height={17} />
      <img loading="lazy" className="ckp-txn__spark ckp-txn__spark--c" src={`${A}/sparkle-c.svg`} alt="" width={28.8} height={28.8} />
    </div>
  );
}

/** App-icon tile + ₺0 seal. */
export function AidatVisual() {
  return (
    <div className="ckp-aidat">
      <span className="ckp-aidat__app">
        <span className="ckp-aidat__icon">
          <img loading="lazy" src={`${A}/icon-card-phone.svg`} alt="" width={61.2549} height={54.3606} />
        </span>
      </span>
      <img loading="lazy" className="ckp-aidat__seal" src={`${A}/badge-zero.svg`} alt="" width={200} height={200} />
    </div>
  );
}
