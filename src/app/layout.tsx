import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { DialRoot } from "dialkit";
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
        {/* dev-only tuning panel (auto-hidden in production builds) */}
        <DialRoot position="bottom-right" defaultOpen={false} />
      </body>
    </html>
  );
}
