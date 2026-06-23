import { imageUrlFor } from "@/lib/sanity/image";
import type { MenuCategory, MenuGroup, MenuItem } from "@/types/menu";

export function compareMenuItems(a: MenuItem, b: MenuItem) {
  if (a.order !== b.order) {
    return a.order - b.order;
  }

  return a.name.localeCompare(b.name, "pl");
}

export function getGroupCategoriesInPageOrder(
  groupId: string,
  categories: MenuCategory[],
) {
  return categories.filter((category) => category.group._ref === groupId);
}

export function getCategoryItemsInPageOrder(
  categoryId: string,
  items: MenuItem[],
) {
  return items
    .filter((item) => item.category._ref === categoryId)
    .sort(compareMenuItems);
}

export function getMenuItemsInPageOrder(
  groups: MenuGroup[],
  categories: MenuCategory[],
  items: MenuItem[],
) {
  const ordered: MenuItem[] = [];

  for (const group of groups) {
    const groupCategories = getGroupCategoriesInPageOrder(group._id, categories);

    for (const category of groupCategories) {
      ordered.push(...getCategoryItemsInPageOrder(category._id, items));
    }
  }

  return ordered;
}

export function getMenuPhotoItemsInPageOrder(
  groups: MenuGroup[],
  categories: MenuCategory[],
  items: MenuItem[],
  imageWidth = 1600,
) {
  return getMenuItemsInPageOrder(groups, categories, items).filter((item) =>
    Boolean(imageUrlFor(item.image, imageWidth)),
  );
}
