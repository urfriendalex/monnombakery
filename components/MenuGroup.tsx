import { MenuSection } from "@/components/MenuSection";
import type { MenuCategory, MenuGroup as MenuGroupType, MenuItem } from "@/types/menu";

type MenuGroupProps = {
  group: MenuGroupType;
  categories: MenuCategory[];
  items: MenuItem[];
};

export function MenuGroup({ group, categories, items }: MenuGroupProps) {
  return (
    <section className="menu-group" aria-labelledby={`${group.slug}-heading`}>
      <div className="group-heading">
        <h2 id={`${group.slug}-heading`}>{group.title}</h2>
        <span>{String(categories.length).padStart(2, "0")} sekcje</span>
      </div>
      {categories.map((category) => (
        <MenuSection
          key={category._id}
          category={category}
          items={items.filter((item) => item.category._ref === category._id)}
        />
      ))}
    </section>
  );
}
