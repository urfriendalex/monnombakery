import { defineField, defineType } from "sanity";

export const menuGroup = defineType({
  name: "menuGroup",
  title: "Menu Group",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({ name: "isVisible", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
