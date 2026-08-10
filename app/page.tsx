import type { Metadata } from "next";

import { HomeExperience } from "@/components/HomeExperience";
import { ui } from "@/lib/i18n";
import { absoluteUrl, siteDescriptionFor, siteName } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: ui.pl.homeTitle,
  description: siteDescriptionFor("pl"),
  alternates: {
    canonical: absoluteUrl("/"),
    languages: { pl: absoluteUrl("/"), en: absoluteUrl("/en") },
  },
  openGraph: {
    title: ui.pl.homeOgTitle,
    description: siteDescriptionFor("pl"),
    url: absoluteUrl("/"),
    siteName,
    locale: "pl_PL",
    alternateLocale: ["en_GB"],
    images: [{ url: absoluteUrl("/menu/photos/sniadanie-losos.jpeg"), width: 1200, height: 630, alt: "Śniadanie z łososiem i awokado w Mon Nom Bakery" }],
  },
};

export default function Home() {
  return <HomeExperience locale="pl" />;
}
