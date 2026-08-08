import type { Metadata } from "next";

import { MenuExperience } from "@/components/MenuExperience";
import { ui } from "@/lib/i18n";
import { absoluteUrl, menuDescriptionFor, siteName } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: ui.pl.menuTitle,
  description: menuDescriptionFor("pl"),
  alternates: {
    canonical: absoluteUrl("/menu"),
    languages: { pl: absoluteUrl("/menu"), en: absoluteUrl("/en/menu") },
  },
  openGraph: {
    title: `${ui.pl.currentMenu} | ${siteName}`,
    description: menuDescriptionFor("pl"),
    url: absoluteUrl("/menu"),
    locale: "pl_PL",
    alternateLocale: ["en_GB"],
    images: [{ url: absoluteUrl("/menu/photos/syrniki-chalwa.jpeg"), width: 1200, height: 630, alt: "Syrniki z chałwą w menu Mon Nom Bakery" }],
  },
};

export default function MenuPage() {
  return <MenuExperience locale="pl" />;
}
