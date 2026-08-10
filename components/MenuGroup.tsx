import { getCategoryItemsInPageOrder } from "@/lib/menu-order";
import { MenuSection } from "@/components/MenuSection";
import type { MenuCategory, MenuGroup as MenuGroupType, MenuItem } from "@/types/menu";
import type { Locale } from "@/lib/i18n";

type MenuGroupProps = {
  group: MenuGroupType;
  categories: MenuCategory[];
  items: MenuItem[];
  locale: Locale;
};

export function MenuGroup({ group, categories, items, locale }: MenuGroupProps) {
  return (
    <section
      className="menu-group"
      id={group.slug}
      data-menu-group-id={group._id}
      aria-labelledby={`${group.slug}-heading`}
    >
      <h2 className="sr-only" id={`${group.slug}-heading`}>{group.title}</h2>
      {categories.map((category) => (
        <MenuSection
          key={category._id}
          category={category}
          items={getCategoryItemsInPageOrder(category._id, items)}
          locale={locale}
          groupId={group._id}
        />
      ))}
    </section>
  );
}
