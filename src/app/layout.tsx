import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Umunsi.com — Entertainment, Health & Social Life through Education",
    template: "%s | Umunsi.com",
  },
  description:
    "Entertainment, Health and Social Life through Education. Home of Umunsimedia.com students App",
  keywords: [
    "Umunsi",
    "amakuru",
    "Rwanda",
    "inkuru",
    "imikino",
    "ikoranabuhanga",
    "imyidagaduro",
    "cinema",
    "health",
  ],
  authors: [{ name: "Umunsi.com" }],
  openGraph: {
    type: "website",
    locale: "rw_RW",
    siteName: "Umunsi.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@umunsi",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
    apple: "/images/round-logo.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#e5b60d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="rw" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3584259871242471"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans">
        {children}
        <Script
          id="profitableratecpm-body"
          strategy="afterInteractive"
          src="https://pl18337357.profitableratecpmnetwork.com/8b/bd/af/8bbdaf0eb5f4fa429c2183dbad47a65a.js"
        />
      </body>
    </html>
  );
}
