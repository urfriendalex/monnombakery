import type { Metadata } from "next";

import { CategoryNav } from "@/components/CategoryNav";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MenuGroup } from "@/components/MenuGroup";
import { PhotoPreviewProvider } from "@/components/PhotoPreviewSheet";
import { SiteShell } from "@/components/SiteShell";
import {
  absoluteUrl,
  menuDescription,
  siteName,
  siteUpdatedAt,
} from "@/lib/seo";
import { getMenuPageData } from "@/lib/sanity/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Aktualne menu",
  description: menuDescription,
  alternates: {
    canonical: absoluteUrl("/menu"),
  },
  openGraph: {
    title: `Aktualne menu | ${siteName}`,
    description: menuDescription,
    url: absoluteUrl("/menu"),
    images: [
      {
        url: absoluteUrl("/menu/photos/syrniki-chalwa.jpeg"),
        width: 1200,
        height: 630,
        alt: "Syrniki z chalwa w menu Mon Nom Bakery",
      },
    ],
  },
};

export default async function Home() {
  const { settings, groups, categories, items } = await getMenuPageData();

  const visibleCategories = categories.filter((category) =>
    items.some((item) => item.category._ref === category._id),
  );
  const menuJsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `Aktualne menu ${siteName}`,
    url: absoluteUrl("/menu"),
    description: menuDescription,
    dateModified: siteUpdatedAt,
    provider: {
      "@type": "Bakery",
      name: siteName,
      url: absoluteUrl("/"),
      address: settings.address,
    },
    hasMenuSection: visibleCategories.map((category) => ({
      "@type": "MenuSection",
      name: category.title,
      description: category.description,
      hasMenuItem: items
        .filter((item) => item.category._ref === category._id)
        .map((item) => ({
          "@type": "MenuItem",
          name: item.name,
          description: item.description,
          image: item.image?.asset?.url
            ? new URL(item.image.asset.url, absoluteUrl("/")).toString()
            : undefined,
          offers: {
            "@type": "Offer",
            price: item.price,
            priceCurrency: "PLN",
            availability: "https://schema.org/InStock",
          },
        })),
    })),
  };

  return (
    <PhotoPreviewProvider items={items}>
      <SiteShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
        />
        <Header settings={settings} />
        <CategoryNav categories={visibleCategories} />
        <main aria-label="Menu" className="menu-stack">
          <h1 className="sr-only">Aktualne menu Mon Nom Bakery w Warszawie</h1>
          {groups.map((group) => {
            const groupCategories = visibleCategories.filter(
              (category) => category.group._ref === group._id,
            );

            if (groupCategories.length === 0) {
              return null;
            }

            return (
              <MenuGroup
                key={group._id}
                group={group}
                categories={groupCategories}
                items={items}
              />
            );
          })}
        </main>
        <Footer settings={settings} />
      </SiteShell>
    </PhotoPreviewProvider>
  );
}
