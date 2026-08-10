import { CategoryNav } from "@/components/CategoryNav";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MenuGroup } from "@/components/MenuGroup";
import { PhotoPreviewProvider } from "@/components/PhotoPreviewSheet";
import { SiteShell } from "@/components/SiteShell";
import { localizedPath, ui, type Locale } from "@/lib/i18n";
import { absoluteUrl, menuDescriptionFor, siteName, siteUpdatedAt } from "@/lib/seo";
import { getMenuPageData } from "@/lib/sanity/queries";

export async function MenuExperience({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  const { settings, groups, categories, items } = await getMenuPageData(locale);
  const visibleCategories = categories.filter((category) =>
    items.some((item) => item.category._ref === category._id),
  );
  const menuJsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${copy.currentMenu} ${siteName}`,
    url: absoluteUrl(localizedPath(locale, "/menu")),
    description: settings.seoDescription ?? menuDescriptionFor(locale),
    dateModified: siteUpdatedAt,
    inLanguage: locale,
    provider: { "@type": "Bakery", name: siteName, url: absoluteUrl(localizedPath(locale, "/")), address: settings.address },
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
          image: item.image?.asset?.url ? new URL(item.image.asset.url, absoluteUrl("/")).toString() : undefined,
          offers: { "@type": "Offer", price: item.price, priceCurrency: "PLN", availability: "https://schema.org/InStock" },
        })),
    })),
  };

  return (
    <PhotoPreviewProvider groups={groups} categories={visibleCategories} items={items} locale={locale}>
      <SiteShell locale={locale}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }} />
        <Header settings={settings} locale={locale} />
        <CategoryNav groups={groups} categories={visibleCategories} locale={locale} />
        <main aria-label="Menu" className="menu-stack">
          <h1 className="sr-only">{copy.menuHeading}</h1>
          {groups.map((group) => {
            const groupCategories = visibleCategories.filter((category) => category.group._ref === group._id);
            return groupCategories.length ? (
              <MenuGroup key={group._id} group={group} categories={groupCategories} items={items} locale={locale} />
            ) : null;
          })}
        </main>
        <Footer settings={settings} locale={locale} path="/menu" />
      </SiteShell>
    </PhotoPreviewProvider>
  );
}
