import { defineField, defineType } from "sanity";

export const menuItem = defineType({
  name: "menuItem",
  title: "Menu Item",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (rule) => rule.required() }),
    defineField({ name: "category", type: "reference", to: [{ type: "menuCategory" }], validation: (rule) => rule.required() }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "price", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "secondaryPrice", type: "string" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageAlt", type: "string" }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "allergens", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "isVisible", type: "boolean", initialValue: true }),
    defineField({ name: "isAvailable", type: "boolean", initialValue: true }),
    defineField({ name: "isFeatured", type: "boolean", initialValue: false }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
