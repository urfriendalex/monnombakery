import { MenuItem } from "@/components/MenuItem";
import type { MenuCategory, MenuItem as MenuItemType } from "@/types/menu";
import type { Locale } from "@/lib/i18n";

type MenuSectionProps = {
  category: MenuCategory;
  items: MenuItemType[];
  locale: Locale;
  groupId: string;
};

export function MenuSection({ category, items, locale, groupId }: MenuSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="menu-section"
      id={category.slug}
      aria-labelledby={`${category.slug}-heading`}
      data-category-section
      data-menu-group-id={groupId}
    >
      <h3 className="section-kicker" id={`${category.slug}-heading`}>
        {category.title}
      </h3>
      {category.description ? (
        <p className="section-description">{category.description}</p>
      ) : null}
      {items.map((item) => (
        <MenuItem key={item._id} item={item} locale={locale} />
      ))}
    </section>
  );
}
