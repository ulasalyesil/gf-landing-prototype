/* Created by Claude — INTERNAL
   GFDES-2175 — stub paranaiyibak homepage.

   Carries ONLY the "paranaiyibak sözlük" entry section, so that section can be
   reviewed in place rather than in isolation. On the real PİB homepage it
   belongs at the very bottom; that homepage doesn't exist in this repo yet, so
   the band above it stands in for "everything else" and is labelled as such
   rather than dressed up — the same "önizleme" honesty the #paranaiyibak
   placement flag uses, so nobody reviews a placeholder as a proposal.

   Delete this page the moment the real PİB homepage lands here, and move
   <SozlukEntrySection /> to the bottom of it. */

import type { Metadata } from "next";
import SozlukEntrySection from "./SozlukEntrySection";

export const metadata: Metadata = {
  title: "paranaiyibak",
  description: "paranaiyibak — getirfinans'ın finansal okuryazarlık girişimi.",
  /* A stub must not be indexed. */
  robots: { index: false, follow: false },
};

export default function PnibHomeStub() {
  return (
    <main className="pnib-main pnib-main--stub">
      {/* Stub-only scaffolding: the real homepage will have its own h1, and the
          sözlük section is an h2 in that document. Without this the stub would
          be a page with no h1 at all, which would show up as an accessibility
          finding against a design that is actually fine in context. Delete it
          with the rest of the stub. */}
      <h1 className="pnib-sr-only">paranaiyibak</h1>

      <div className="pnib-container">
        <div className="pnib-stub" role="note">
          <p className="pnib-stub__tag">önizleme</p>
          <p className="pnib-stub__copy">
            pib ana sayfası bu repoda henüz yok. bu sayfa yalnızca en altta yer alacak
            <strong> sözlük bölümünü </strong>
            yerinde göstermek için var.
          </p>
        </div>
      </div>

      {/* The section under review — last on the page, as specified. */}
      <SozlukEntrySection />
    </main>
  );
}
