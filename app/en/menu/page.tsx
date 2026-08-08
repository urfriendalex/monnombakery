import type { Metadata } from "next";

import { MenuExperience } from "@/components/MenuExperience";
import { ui } from "@/lib/i18n";
import { absoluteUrl, menuDescriptionFor, siteName } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: ui.en.menuTitle,
  description: menuDescriptionFor("en"),
  alternates: {
    canonical: absoluteUrl("/en/menu"),
    languages: { pl: absoluteUrl("/menu"), en: absoluteUrl("/en/menu") },
  },
  openGraph: {
    title: `${ui.en.currentMenu} | ${siteName}`,
    description: menuDescriptionFor("en"),
    url: absoluteUrl("/en/menu"),
    locale: "en_GB",
    alternateLocale: ["pl_PL"],
    images: [{ url: absoluteUrl("/menu/photos/syrniki-chalwa.jpeg"), width: 1200, height: 630, alt: "Syrniki with halva on the Mon Nom Bakery menu" }],
  },
};

export default function EnglishMenuPage() {
  return <MenuExperience locale="en" />;
}
