import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

/* Dev tools behind a LAZY import, not a static one. The old
   `{NODE_ENV !== "production" && <DialRoot />}` gated the render but not the
   bundle: measured on a clean production build, dialkit + agentation shipped as
   a 414KB chunk on /hesap-karti — a quarter of that page's JS — for UI that
   never renders in production. Dynamic import puts them in a chunk production
   never requests. See src/dials/DevTools.tsx. */
/* The gate is at MODULE scope, not inside the JSX. Turbopack substitutes
   process.env.NODE_ENV at build time, so in a production build this ternary
   folds to `() => null` and the import() below becomes unreachable and is
   eliminated. Written as `{cond && <DevTools/>}` in the JSX instead, the
   dynamic() call still ran at module scope and the chunk stayed in the graph —
   measured: the 443KB dialkit+agentation chunk was still being requested.
   No `ssr: false`: this is a Server Component and Next rejects that option
   here. DevTools is a client component and the previous static version was
   server-rendered too, so dev behaviour is unchanged. */
const DevTools =
  process.env.NODE_ENV !== "production"
    ? dynamic(() => import("@/dials/DevTools"))
    : () => null;

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
        <DevTools />
      </body>
    </html>
  );
}
