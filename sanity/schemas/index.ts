import { menuCategory } from "@/sanity/schemas/menuCategory";
import { menuGroup } from "@/sanity/schemas/menuGroup";
import { menuItem } from "@/sanity/schemas/menuItem";
import { restaurantSettings } from "@/sanity/schemas/restaurantSettings";

export const schemaTypes = [
  restaurantSettings,
  menuGroup,
  menuCategory,
  menuItem,
];
