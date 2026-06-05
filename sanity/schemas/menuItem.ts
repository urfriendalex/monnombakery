import { defineField, defineType } from "sanity";

export const menuItem = defineType({
  name: "menuItem",
  title: "Menu Item",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "pricing", title: "Pricing" },
    { name: "media", title: "Media" },
    { name: "admin", title: "Admin" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "admin",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      type: "reference",
      group: "content",
      to: [{ type: "menuCategory" }],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3, group: "content" }),
    defineField({
      name: "price",
      title: "Primary price",
      type: "string",
      group: "pricing",
      description: "Keep as text so values like 16/19 or from 25 remain possible.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryPrice",
      title: "Secondary price",
      type: "string",
      group: "pricing",
      description: "Optional extra price line, for example large size or set price.",
    }),
    defineField({
      name: "dietaryLabels",
      title: "Dietary labels",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Examples: vegan, vegetarian, gluten free.",
    }),
    defineField({
      name: "badgeLabel",
      title: "Badge label",
      type: "string",
      group: "content",
      description: "Optional short label like new, bestseller, seasonal.",
    }),
    defineField({
      name: "servingNote",
      title: "Serving note",
      type: "string",
      group: "content",
      description: "Optional admin-editable note for sizes, availability windows, or service context.",
    }),
    defineField({ name: "image", title: "Main photo", type: "image", group: "media", options: { hotspot: true } }),
    defineField({ name: "imageAlt", title: "Image alt text", type: "string", group: "media" }),
    defineField({
      name: "gallery",
      title: "Additional photos",
      type: "array",
      group: "media",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "tags", type: "array", group: "admin", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "allergens", type: "array", group: "content", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "isVisible", title: "Show on site", type: "boolean", group: "admin", initialValue: true }),
    defineField({ name: "isAvailable", title: "Currently available", type: "boolean", group: "admin", initialValue: true }),
    defineField({ name: "isFeatured", title: "Featured item", type: "boolean", group: "admin", initialValue: false }),
    defineField({ name: "order", type: "number", group: "admin", initialValue: 0 }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      media: "image",
      price: "price",
      visible: "isVisible",
      available: "isAvailable",
    },
    prepare({ title, subtitle, media, price, visible, available }) {
      const state = visible === false ? "Hidden" : available === false ? "Unavailable" : "Visible";
      return {
        title,
        subtitle: [subtitle, price ? `${price} PLN` : null, state].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
