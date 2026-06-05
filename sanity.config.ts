import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "af0oyl40";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "monnom_menu",
  title: "Mon Nom Menu",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Restaurant Settings")
              .id("restaurant-settings")
              .child(
                S.document()
                  .schemaType("restaurantSettings")
                  .documentId("restaurant-settings"),
              ),
            S.divider(),
            S.documentTypeListItem("menuItem").title("Menu Items"),
            S.documentTypeListItem("menuCategory").title("Menu Categories"),
            S.documentTypeListItem("menuGroup").title("Menu Groups"),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
