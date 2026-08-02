import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/lib/site-data";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Strength Is Built`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL("https://www.aurevon.example"),
  openGraph: {
    title: `${siteConfig.name} — Strength Is Built`,
    description: siteConfig.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
