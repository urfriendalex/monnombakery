import { mockMenuData } from "@/lib/mock-data";
import { getSanityClient, hasSanityConfig } from "@/lib/sanity/client";
import type { MenuPageData } from "@/types/menu";

export const restaurantSettingsQuery = `*[_type == "restaurantSettings"][0]{
  _id,
  name,
  logo,
  decorativeLogo,
  description,
  address,
  phone,
  email,
  instagramUrl,
  reservationUrl,
  openingHoursWeekdays,
  openingHoursWeekend,
  footerNote,
  seoTitle,
  seoDescription
}`;

export const visibleMenuGroupsQuery = `*[_type == "menuGroup" && isVisible == true] | order(order asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  order,
  isVisible
}`;

export const visibleMenuCategoriesQuery = `*[_type == "menuCategory" && isVisible == true] | order(order asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  group,
  description,
  order,
  isVisible
}`;

export const visibleMenuItemsQuery = `*[
  _type == "menuItem" &&
  isVisible == true &&
  isAvailable == true
] | order(order asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  category,
  description,
  price,
  secondaryPrice,
  image,
  imageAlt,
  tags,
  allergens,
  isVisible,
  isAvailable,
  isFeatured,
  order
}`;

export async function getMenuPageData(): Promise<MenuPageData> {
  if (!hasSanityConfig) {
    return mockMenuData;
  }

  try {
    const client = getSanityClient();
    const [settings, groups, categories, items] = await Promise.all([
      client.fetch(restaurantSettingsQuery),
      client.fetch(visibleMenuGroupsQuery),
      client.fetch(visibleMenuCategoriesQuery),
      client.fetch(visibleMenuItemsQuery),
    ]);

    return {
      settings: settings ?? mockMenuData.settings,
      groups: groups.length ? groups : mockMenuData.groups,
      categories: categories.length ? categories : mockMenuData.categories,
      items: items.length ? items : mockMenuData.items,
    };
  } catch (error) {
    console.warn("Falling back to mock menu data:", error);
    return mockMenuData;
  }
}
