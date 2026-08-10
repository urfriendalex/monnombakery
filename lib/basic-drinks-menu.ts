import basicDrinksMenu from "@/content/basic-drinks-menu.json";
import type { MenuCategory, MenuGroup, MenuItem, MenuPageData } from "@/types/menu";

const ref = (_ref: string) => ({ _type: "reference" as const, _ref });

export function applyBasicDrinksMenu(data: MenuPageData): MenuPageData {
  const groups = data.groups.map((group) =>
    group._id === basicDrinksMenu.foodGroup._id
      ? { ...group, ...basicDrinksMenu.foodGroup }
      : group,
  );

  if (!groups.some((group) => group._id === basicDrinksMenu.drinksGroup._id)) {
    groups.push(basicDrinksMenu.drinksGroup as MenuGroup);
  }

  const configuredCategoryIds = new Set(
    basicDrinksMenu.categories.map((category) => category._id),
  );
  const categories = data.categories
    .map((category) => {
      const configured = basicDrinksMenu.categories.find(
        (candidate) => candidate._id === category._id,
      );

      if (configured) {
        return {
          ...category,
          ...configured,
          group: ref(configured.groupId),
        };
      }

      if (category._id === "cat-matcha") {
        return { ...category, group: ref("group-drinks"), isVisible: false };
      }

      return category;
    })
    .concat(
      basicDrinksMenu.categories
        .filter(
          (category) =>
            configuredCategoryIds.has(category._id) &&
            !data.categories.some((existing) => existing._id === category._id),
        )
        .map(
          (category): MenuCategory => ({
            _id: category._id,
            title: category.title,
            titleEn: category.titleEn,
            slug: category.slug,
            group: ref(category.groupId),
            order: category.order,
            isVisible: category.isVisible,
          }),
        ),
    );

  const items = data.items.map((item) => {
    const patch = basicDrinksMenu.existingItemPatches.find(
      (candidate) => candidate._id === item._id,
    );

    if (!patch) return item;

    return {
      ...item,
      order: patch.order,
      ...("price" in patch ? { price: patch.price } : {}),
      category: ref(patch.categoryId),
    };
  });

  for (const item of basicDrinksMenu.items) {
    if (items.some((existing) => existing._id === item._id)) continue;

    const { categoryId, ...fields } = item;

    items.push({
      ...fields,
      category: ref(categoryId),
      isVisible: true,
      isAvailable: true,
      isFeatured: false,
    } as MenuItem);
  }

  return {
    ...data,
    groups: groups.sort((a, b) => a.order - b.order),
    categories,
    items,
  };
}
