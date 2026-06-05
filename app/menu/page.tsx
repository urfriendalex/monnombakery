import { CategoryNav } from "@/components/CategoryNav";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MenuGroup } from "@/components/MenuGroup";
import { PhotoPreviewProvider } from "@/components/PhotoPreviewSheet";
import { SiteShell } from "@/components/SiteShell";
import { getMenuPageData } from "@/lib/sanity/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const { settings, groups, categories, items } = await getMenuPageData();

  const visibleCategories = categories.filter((category) =>
    items.some((item) => item.category._ref === category._id),
  );

  return (
    <PhotoPreviewProvider items={items}>
      <SiteShell>
        <Header settings={settings} />
        <CategoryNav categories={visibleCategories} />
        <main aria-label="Menu" className="menu-stack">
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
