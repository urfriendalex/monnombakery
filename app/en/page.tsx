import type { Metadata } from "next";

import { HomeExperience } from "@/components/HomeExperience";
import { ui } from "@/lib/i18n";
import { absoluteUrl, siteDescriptionFor, siteName } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: ui.en.homeTitle,
  description: siteDescriptionFor("en"),
  alternates: {
    canonical: absoluteUrl("/en"),
    languages: { pl: absoluteUrl("/"), en: absoluteUrl("/en") },
  },
  openGraph: {
    title: ui.en.homeOgTitle,
    description: siteDescriptionFor("en"),
    url: absoluteUrl("/en"),
    siteName,
    locale: "en_GB",
    alternateLocale: ["pl_PL"],
    images: [{ url: absoluteUrl("/menu/photos/sniadanie-losos.jpeg"), width: 1200, height: 630, alt: "Salmon and avocado breakfast at Mon Nom Bakery" }],
  },
};

export default function EnglishHome() {
  return <HomeExperience locale="en" />;
}
