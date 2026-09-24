import React from "react";

/* `variant="inner"` is the product-page footer from the card pages v2 comps
   (Figma 22630:12711): its own CTA sub, three more legal links, getirsonraöde
   in ürünler, and the referral footnote. The landing renders the default and
   is unchanged. The comp lists "çerez politikası" twice; it appears once here. */
interface FooterProps {
  variant?: "home" | "inner";
}

export default function Footer({ variant = "home" }: FooterProps) {
  const inner = variant === "inner";
  return (
    <footer className={inner ? "footer footer--inner" : "footer"} id="footer">
      <div className="footer__panel">
        <div className="container">
          {/* Footer CTA Download Section */}
          <div className="footer__cta">
            <div>
              <h2 className="footer__cta-title">getirfinans’ı indir</h2>
              <p className="footer__cta-sub">
                {inner ? (
                  "getirfinans’ın bankacılık hizmetlerinden hemen yararlanmaya başla"
                ) : (
                  <>
                    çok iyi faizli çok masrafsız bankacılık hizmetlerinden hemen
                    yararlanmaya başla
                  </>
                )}
              </p>
            </div>
            <div className="footer__badges">
              <a className="store-badge" href="#">
                <img src="/assets/badges/app-store.svg" alt="App Store" />
              </a>
              <a className="store-badge" href="#">
                <img src="/assets/badges/google-play.svg" alt="Google Play" />
              </a>
              <a className="store-badge" href="#">
                <img src="/assets/badges/app-gallery.svg" alt="AppGallery" />
              </a>
            </div>
          </div>

          {/* Footer Main Columns */}
          <div className="footer__main">
            <div className="footer__brand">
              <img
                src="/assets/logos/getirfinans-dark.svg"
                alt="getirfinans"
                className="footer__logo"
              />
              <div className="footer__social">
                <a
                  href="https://www.tiktok.com/@getirfinans?lang=tr-TR"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/assets/icons/tiktok.svg" alt="TikTok" />
                </a>
                <a
                  href="https://x.com/getirfinans"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/assets/icons/x.svg" alt="X" />
                </a>
                <a
                  href="https://www.instagram.com/getirfinans/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/assets/icons/instagram.svg" alt="Instagram" />
                </a>
                <a
                  href="https://www.youtube.com/@getirfinans"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/assets/icons/youtube.svg" alt="YouTube" />
                </a>
                <a
                  href="https://www.linkedin.com/company/getirfinans/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/assets/icons/linkedin.svg" alt="LinkedIn" />
                </a>
              </div>
            </div>

            <nav className="footer__col">
              <h4>getirfinans’ı keşfet</h4>
              <a href="#">hakkımızda</a>
              <a href="#">iletişim</a>
              <a href="#">medya</a>
              <a href="#">planlı kesintiler</a>
              <a href="#">kampanyalar</a>
              <a href="#">duyurular</a>
            </nav>

            <nav className="footer__col">
              <h4>yardıma mı ihtiyacın var?</h4>
              <a href="#">güvenlik</a>
              <a href="#">kişisel verilerin korunması politikası</a>
              <a href="#">gizlilik politikası</a>
              <a href="#">kullanım koşulları</a>
              <a href="#">iletişim aydınlatma metni</a>
              {inner && <a href="#">kullanıcı kişisel verileri aydınlatma metni</a>}
              {inner && <a href="#">internet sitesi ziyaretçilerine yönelik aydınlatma metni</a>}
              <a href="#">çerez politikası</a>
              <a href="#">ilgili kişi başvuru formu</a>
              {inner && <a href="#">çalışan adayı aydınlatma metni</a>}
            </nav>

            <nav className="footer__col">
              <h4>ürünler</h4>
              <a href="#">hesap</a>
              <a href="#">kredi kartı</a>
              <a href="#">kredi</a>
              <a href="#">avans limit</a>
              {inner && <a href="#">getirsonraöde</a>}
              <a href="#">para transferi</a>
              <a href="#">döviz işlemleri</a>
              <a href="#">ücretsiz atm’ler</a>
              <a href="#">ödemeler</a>
            </nav>
          </div>

          {inner && (
            <p className="footer__note">
              <span aria-hidden="true">*</span> 2026 yılı itibariyle &quot;arkadaşını getir&quot; kampanyaları
              üzerinden davet üzerine referans kodu ile getirfinans müşterisi olan
              müşteriler hesaplamaya dahil edilmiştir
            </p>
          )}

          {/* Legal notice */}
          <div className="footer__legal">
            <span>© 2026 getirfinans · bilgi toplumu hizmetleri</span>
            <span className="footer__fiba">
              bankacılık hizmeti{" "}
              <span className="fiba">
                <img src="/assets/logos/fibabanka-logo.svg" alt="Fibabanka" />
              </span>{" "}
              tarafından verilmektedir
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
