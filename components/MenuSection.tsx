import { MenuItem } from "@/components/MenuItem";
import type { MenuCategory, MenuItem as MenuItemType } from "@/types/menu";

type MenuSectionProps = {
  category: MenuCategory;
  items: MenuItemType[];
};

export function MenuSection({ category, items }: MenuSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="menu-section"
      id={category.slug}
      aria-labelledby={`${category.slug}-heading`}
      data-category-section
    >
      <h3 className="section-kicker" id={`${category.slug}-heading`}>
        {category.title}
      </h3>
      {category.description ? (
        <p className="section-description">{category.description}</p>
      ) : null}
      {items.map((item) => (
        <MenuItem key={item._id} item={item} />
      ))}
    </section>
  );
}
