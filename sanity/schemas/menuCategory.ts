import { defineField, defineType } from "sanity";

export const menuCategory = defineType({
  name: "menuCategory",
  title: "Menu Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "group", type: "reference", to: [{ type: "menuGroup" }], validation: (rule) => rule.required() }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({ name: "isVisible", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: {
      title: "title",
      group: "group.title",
      visible: "isVisible",
    },
    prepare({ title, group, visible }) {
      return {
        title,
        subtitle: [group, visible === false ? "Hidden" : "Visible"].filter(Boolean).join(" · "),
      };
    },
  },
});
