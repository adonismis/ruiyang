import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RevealObserver } from "@/components/interactions";
import "@fontsource-variable/inter";
import "@fontsource-variable/noto-sans-tc";
import "./globals.css";
import "./responsive.css";
import "./inner-pages.css";
import "./catalog.css";
import "./company-pages.css";
import "./contact.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: "睿洋機電工程有限公司｜專業為本・品質為先",
  description:
    "睿洋機電工程有限公司，追求企業永續經營及成長，以良好工程品質與專業服務態度作為企業發展方向。認識睿洋、探索工程服務與企業資訊。",
  applicationName: "睿洋機電",
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    title: "睿洋機電工程有限公司｜專業為本・品質為先",
    description:
      "專業機電工程，成就卓越建築。認識睿洋機電的企業理念與專業服務方向。",
    type: "website",
    locale: "zh_TW",
    siteName: "睿洋機電工程有限公司",
    ...(siteUrl
      ? {
          url: "/",
          images: [
            {
              url: "/images/architecture-hero.jpg",
              width: 2200,
              height: 1467,
              alt: "商辦建築情境示意照片",
            },
          ],
        }
      : {}),
  },
  robots: { index: Boolean(siteUrl), follow: Boolean(siteUrl) },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" data-scroll-behavior="smooth">
      <body id="page-top">
        <a href="#main-content" className="skip-link">
          跳至主要內容
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
