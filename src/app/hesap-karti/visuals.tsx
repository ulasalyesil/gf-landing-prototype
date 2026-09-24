/* Created by Claude · INTERNAL */
import { DEBIT_BENEFITS } from "@/data/content";

/* Bento tile illustrations for /hesap-karti (card pages v2): the benefit
   bento (Figma 22630:18396) and the abroad bento (22630:19413). Rebuilt from
   the comp's layers — phone outlines, skeleton screens, the wallet widget,
   the iOS notification — so each piece can animate later. Geometry is comp
   px through `--u` (see `.dpc-tile__visual`); all of it is decorative. */

const A = "/assets/img/hesap-karti";

/* Skeleton app screen: two cards over a list row (tile 1) or an icon row (tile 2). */
function SkeletonCard({ tall }: { tall?: boolean }) {
  return (
    <span className={tall ? "dpc-skel__card dpc-skel__card--tall" : "dpc-skel__card"}>
      <i className="dpc-skel__bar" />
      <span className="dpc-skel__pair">
        <i className="dpc-skel__bar dpc-skel__bar--s" />
        <i className="dpc-skel__bar" />
      </span>
      <i className="dpc-skel__bar dpc-skel__bar--s" />
      {tall && (
        <span className="dpc-skel__pair">
          <i className="dpc-skel__bar dpc-skel__bar--s" />
          <i className="dpc-skel__bar" />
        </span>
      )}
    </span>
  );
}

/** getirmarket / getirbitaksi pills over a phone holding the getirpara wallet. */
export function GetirparaVisual() {
  const w = DEBIT_BENEFITS.getirpara.wallet;
  return (
    <div className="dpc-gp">
      <div className="dpc-gp__phone">
        <div className="dpc-gp__screen">
          <div className="dpc-skel">
            <span className="dpc-skel__row">
              <SkeletonCard tall />
              <SkeletonCard tall />
            </span>
            <span className="dpc-skel__item">
              <i className="dpc-skel__sq" />
              <span className="dpc-skel__pair dpc-skel__pair--fill">
                <i className="dpc-skel__bar" />
                <i className="dpc-skel__bar dpc-skel__bar--xs" />
              </span>
            </span>
          </div>
        </div>
        <span className="dpc-gp__frame" />
        <span className="dpc-gp__home" />
      </div>

      <div className="dpc-gp__wallet">
        <span className="dpc-gp__w-head">
          <span className="dpc-gp__w-label">{w.label}</span>
          <span className="dpc-gp__w-brand">{w.brand}</span>
          <span className="dpc-gp__w-amount">
            <small>{w.amount.cur}</small>
            {w.amount.int}
            <small>{w.amount.dec}</small>
          </span>
        </span>
        <span className="dpc-gp__w-meter">
          <span className="dpc-gp__w-track" />
          <span className="dpc-gp__w-fill" style={{ width: `${w.progress * 100}%` }} />
          <span className="dpc-gp__w-cap">
            <b>
              <small>{w.cap.cur}</small>
              {w.cap.int}
              <small>{w.cap.dec}</small>
            </b>{" "}
            <small>{w.cap.unit}</small>
          </span>
        </span>
        <span className="dpc-gp__w-total">
          <span>{w.totalLabel}</span>
          <b>{w.total}</b>
        </span>
      </div>

      <div className="dpc-gp__pills">
        <span className="dpc-gp__pill">
          <span className="dpc-gp__pill-in">
            <img loading="lazy" src={`${A}/wordmark-getirmarket.svg`} alt="" width={95.8264} height={16} />
          </span>
        </span>
        <img loading="lazy" className="dpc-gp__dots" src={`${A}/connector-dots.svg`} alt="" width={15.4378} height={1.75104} />
        <span className="dpc-gp__pill">
          <img loading="lazy" src={`${A}/pill-getirbitaksi.svg`} alt="" width={138.489} height={44.4444} />
        </span>
      </div>
    </div>
  );
}

/** Phone with a nakit iade notification, over the subscription marks. */
export function AbonelikVisual() {
  const n = DEBIT_BENEFITS.abonelik.notification;
  return (
    <div className="dpc-ab">
      <div className="dpc-ab__screen">
        <span className="dpc-skel__row">
          <SkeletonCard />
          <SkeletonCard />
        </span>
        <span className="dpc-ab__apps">
          <img loading="lazy" src={`${A}/skeleton-app-a.svg`} alt="" width={42.6121} height={63.208} />
          <img loading="lazy" src={`${A}/skeleton-app-a.svg`} alt="" width={42.6121} height={63.208} />
          <img loading="lazy" src={`${A}/skeleton-app-b.svg`} alt="" width={42.6121} height={63.208} />
          <img loading="lazy" src={`${A}/skeleton-app-a.svg`} alt="" width={42.6121} height={63.208} />
        </span>
      </div>
      <span className="dpc-ab__frame" />
      <img loading="lazy" className="dpc-ab__island" src={`${A}/phone-island.svg`} alt="" width={76.9575} height={26.8456} />

      <div className="dpc-ab__note">
        <span className="dpc-appicon">
          <span className="dpc-appicon__angle">
            <i />
          </span>
          <img loading="lazy" className="dpc-appicon__getir" src={`${A}/appicon-getir.svg`} alt="" width={19.8447} height={8.95117} />
          <span className="dpc-appicon__finans">
            <img loading="lazy" src={`${A}/appicon-finans.svg`} alt="" width={166.651} height={176.668} />
          </span>
        </span>
        <span className="dpc-ab__note-text">
          <b>{n.app}</b>
          <span>{n.body}</span>
        </span>
        <span className="dpc-ab__note-time">{n.time}</span>
      </div>

      <div className="dpc-ab__marks">
        <span className="dpc-ab__mark dpc-ab__mark--amazon">
          <img loading="lazy" src={`${A}/logo-amazon.png`} alt="" width={160} height={160} />
        </span>
        <img loading="lazy" className="dpc-ab__dots" src={`${A}/connector-dots-2.svg`} alt="" width={13.6468} height={1.5479} />
        <span className="dpc-ab__mark dpc-ab__mark--spotify">
          <img loading="lazy" src={`${A}/logo-spotify.png`} alt="" width={160} height={160} />
        </span>
      </div>
    </div>
  );
}

/** Plane trail around the ₺ card, with two %1 coins. */
export function CashbackVisual() {
  return (
    <div className="dpc-cb">
      <img loading="lazy" className="dpc-cb__art" src={`${A}/abroad-cashback-visual.svg`} alt="" width={506.558} height={397} />
      <span className="dpc-cb__coin dpc-cb__coin--a">%1</span>
      <span className="dpc-cb__coin dpc-cb__coin--b">%1</span>
    </div>
  );
}

/** EUR → wallet (TL) ← USD. */
export function FxVisual() {
  return (
    <div className="dpc-fx">
      <div className="dpc-fx__row">
        <img loading="lazy" src={`${A}/flag-eu.svg`} alt="" width={32} height={32} />
        <img loading="lazy" className="dpc-fx__dots" src={`${A}/connector-dots.svg`} alt="" width={15.4378} height={1.75104} />
        <span className="dpc-wallet">
          <img loading="lazy" className="dpc-wallet__flap" src={`${A}/wallet-flap.svg`} alt="" width={26.5714} height={21.4327} />
          <i className="dpc-wallet__body" />
          <i className="dpc-wallet__face" />
          <i className="dpc-wallet__shine" />
          <span className="dpc-wallet__flag">
            <img loading="lazy" className="dpc-wallet__ring" src={`${A}/wallet-flag-ring.svg`} alt="" width={41.1429} height={41.1429} />
            <span className="dpc-wallet__tr">
              <img loading="lazy" src={`${A}/flag-tr.png`} alt="" width={128} height={85} />
            </span>
          </span>
          <i className="dpc-wallet__tab" />
        </span>
        <img loading="lazy" className="dpc-fx__dots" src={`${A}/connector-dots.svg`} alt="" width={15.4378} height={1.75104} />
        <img loading="lazy" src={`${A}/flag-us.svg`} alt="" width={32} height={32} />
      </div>
      <span className="dpc-fx__tag dpc-fx__tag--eur">EUR</span>
      <span className="dpc-fx__tag dpc-fx__tag--usd">USD</span>
    </div>
  );
}
