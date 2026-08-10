import { mockMenuData } from "@/lib/mock-data";
import { applyMenuPhotoManifest } from "@/lib/menu-photo-manifest";
import { localizeMenuPageData, type Locale } from "@/lib/i18n";
import { getSanityClient, hasSanityConfig } from "@/lib/sanity/client";
import type { MenuPageData } from "@/types/menu";

const canUseMockData = process.env.NODE_ENV !== "production";

export const restaurantSettingsQuery = `*[_type == "restaurantSettings"][0]{
  _id,
  name,
  logo{
    ...,
    asset->{
      _id,
      url,
      metadata { dimensions }
    }
  },
  decorativeLogo{
    ...,
    asset->{
      _id,
      url,
      metadata { dimensions }
    }
  },
  description,
  descriptionEn,
  address,
  mapUrl,
  phone,
  email,
  instagramUrl,
  reservationUrl,
  openingHoursWeekdays,
  openingHoursWeekdaysEn,
  openingHoursWeekend,
  openingHoursWeekendEn,
  brunchHoursWeekdays,
  brunchHoursWeekdaysEn,
  brunchHoursWeekend,
  brunchHoursWeekendEn,
  footerNote,
  footerNoteEn,
  seoTitle,
  seoTitleEn,
  seoDescription,
  seoDescriptionEn
}`;

export const visibleMenuGroupsQuery = `*[_type == "menuGroup" && isVisible == true] | order(order asc, title asc) {
  _id,
  title,
  titleEn,
  "slug": slug.current,
  order,
  isVisible
}`;

export const visibleMenuCategoriesQuery = `*[_type == "menuCategory" && isVisible == true] | order(order asc, title asc) {
  _id,
  title,
  titleEn,
  "slug": slug.current,
  group,
  description,
  descriptionEn,
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
  nameEn,
  "slug": slug.current,
  category,
  description,
  descriptionEn,
  price,
  secondaryPrice,
  dietaryLabels,
  dietaryLabelsEn,
  badgeLabel,
  badgeLabelEn,
  servingNote,
  servingNoteEn,
  image{
    ...,
    asset->{
      _id,
      url,
      metadata {
        dimensions,
        lqip,
        palette
      }
    }
  },
  imageAlt,
  imageAltEn,
  gallery[]{
    ...,
    asset->{
      _id,
      url,
      metadata {
        dimensions,
        lqip,
        palette
      }
    }
  },
  tags,
  tagsEn,
  allergens,
  allergensEn,
  isVisible,
  isAvailable,
  isFeatured,
  order
}`;

export async function getMenuPageData(locale: Locale = "pl"): Promise<MenuPageData> {
  if (!hasSanityConfig) {
    if (!canUseMockData) {
      throw new Error("Missing Sanity configuration in production.");
    }

    return localizeMenuPageData({
      ...mockMenuData,
      items: applyMenuPhotoManifest(mockMenuData.items),
    }, locale);
  }

  try {
    const client = getSanityClient();
    const [settings, groups, categories, items] = await Promise.all([
      client.fetch(restaurantSettingsQuery),
      client.fetch(visibleMenuGroupsQuery),
      client.fetch(visibleMenuCategoriesQuery),
      client.fetch(visibleMenuItemsQuery),
    ]);

    return localizeMenuPageData({
      settings: settings ?? mockMenuData.settings,
      groups,
      categories,
      items,
    }, locale);
  } catch (error) {
    if (!canUseMockData) {
      throw error;
    }

    console.warn("Falling back to mock menu data:", error);
    return localizeMenuPageData({
      ...mockMenuData,
      items: applyMenuPhotoManifest(mockMenuData.items),
    }, locale);
  }
}
