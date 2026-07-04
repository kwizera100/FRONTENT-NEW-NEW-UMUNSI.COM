import type { Metadata } from "next";
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
    default: "Umunsi.com — Inkuru z'u Rwanda n'Isi",
    template: "%s | Umunsi.com",
  },
  description:
    "Umunsi.com ni urubuga rw'inkuru z'icyamamare mu Rwanda no ku isi. Amakuru, Imikino, Ikoranabuhanga, Imyidagaduro, n'ibindi byinshi.",
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
      <body className="font-sans">{children}</body>
    </html>
  );
}
