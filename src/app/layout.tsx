import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { DialRoot } from "dialkit";
import { Agentation } from "agentation";
import SpacingDial from "@/dials/SpacingDial";
import "dialkit/styles.css";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "getirfinans — ama ne finans!",
  description: "getirfinans — %44 faizle her gün kazan, uygun oranlı kredi kullan, harcarken geri kazan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${openSans.variable} antialiased`}>
      <body className="font-sans text-gf-ink bg-gf-bg min-h-screen">
        {children}
        {/* dev-only tuning panel. Gated the same way as Agentation below —
            DialRoot's own `productionEnabled` default is unreliable in the client
            bundle (it reads `typeof process`, which the browser build doesn't
            always define, and falls through to `true`), so the panel was shipping
            on the Vercel deploy at z-index 9999. Gate at the mount instead.
            bottom-left so it clears Agentation's bottom-right toolbar. */}
        {process.env.NODE_ENV !== "production" && (
          <>
            <DialRoot position="bottom-left" defaultOpen={false} />
            {/* section-rhythm A/B — writes data-gf-spacing on <html>, styled by
                styles/spacing-system.css. Renders nothing. Delete with the
                proposal once the rhythm is settled. */}
            <SpacingDial />
          </>
        )}
        {/* dev-only visual-feedback overlay: click elements → annotate → copy
            structured markdown for the agent. Gated so it never ships. */}
        {process.env.NODE_ENV !== "production" && <Agentation />}
      </body>
    </html>
  );
}
