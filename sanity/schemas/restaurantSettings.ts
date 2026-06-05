import { defineField, defineType } from "sanity";

export const restaurantSettings = defineType({
  name: "restaurantSettings",
  title: "Restaurant Settings",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "decorativeLogo", type: "image", options: { hotspot: true } }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "address", type: "string" }),
    defineField({ name: "mapUrl", type: "url" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "instagramUrl", type: "url" }),
    defineField({ name: "reservationUrl", type: "url" }),
    defineField({ name: "openingHoursWeekdays", type: "string" }),
    defineField({ name: "openingHoursWeekend", type: "string" }),
    defineField({ name: "brunchHoursWeekdays", type: "string" }),
    defineField({ name: "brunchHoursWeekend", type: "string" }),
    defineField({ name: "footerNote", type: "string" }),
    defineField({ name: "seoTitle", type: "string" }),
    defineField({ name: "seoDescription", type: "text" }),
  ],
});
