import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { GlobalAdScripts } from "@/components/GlobalAdScripts";
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
    default: "Umunsi English — News, Entertainment, Health & Social Life",
    template: "%s | Umunsi English",
  },
  description:
    "Entertainment, Health and Social Life through Education. Home of Umunsimedia.com students App",
  keywords: [
    "Umunsi",
    "news",
    "Rwanda",
    "stories",
    "sports",
    "technology",
    "entertainment",
    "cinema",
    "health",
  ],
  authors: [{ name: "Umunsi.com" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Umunsi English",
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
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans">
        {children}
        <GlobalAdScripts />
      </body>
    </html>
  );
}
