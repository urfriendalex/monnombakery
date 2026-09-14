import type { Metadata } from "next";
import { headers } from "next/headers";
import { Archivo_Black, IBM_Plex_Mono } from "next/font/google";
import { AnalyticsBody, AnalyticsHead } from "@/components/Analytics";
import { SmoothScroll } from "@/components/SmoothScroll";
import { absoluteUrl, siteDescription, siteName, siteUrl } from "@/lib/seo";
import "lenis/dist/lenis.css";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: absoluteUrl("/"),
    siteName,
    images: [
      {
        url: absoluteUrl("/menu/photos/sniadanie-losos.jpeg"),
        width: 1200,
        height: 630,
        alt: "Sniadanie z lososiem i awokado w Mon Nom Bakery",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-site-locale") === "en" ? "en" : "pl";
  // proxy.ts only runs (and sets this header) for public pages, not /studio.
  const analyticsEnabled =
    process.env.NODE_ENV === "production" && requestHeaders.has("x-site-locale");

  return (
    <html
      lang={locale}
      className={`${plexMono.variable} ${archivoBlack.variable} h-full antialiased`}
    >
      <AnalyticsHead enabled={analyticsEnabled} />
      <body className="min-h-full flex flex-col">
        <AnalyticsBody enabled={analyticsEnabled} />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
