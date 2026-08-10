import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-05-21";

if (!projectId || !token) {
  throw new Error(
    "Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local before populating the drinks menu.",
  );
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const menu = JSON.parse(
  readFileSync(path.join(rootDir, "content/basic-drinks-menu.json"), "utf8"),
);
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const ref = (_ref) => ({ _type: "reference", _ref });
const slug = (current) => ({ _type: "slug", current });

const requiredIds = [
  menu.foodGroup._id,
  "cat-coffee",
  "cat-matcha",
  ...menu.existingItemPatches.map((item) => item._id),
];
const existingIds = new Set(
  await client.fetch(`*[_id in $ids]._id`, { ids: requiredIds }),
);
const missingIds = requiredIds.filter((id) => !existingIds.has(id));

if (missingIds.length) {
  throw new Error(
    `Cannot populate the drinks menu; missing Sanity documents: ${missingIds.join(", ")}`,
  );
}

const groupDocument = (group) => ({
  ...group,
  _type: "menuGroup",
  slug: slug(group.slug),
});
const categoryDocument = (category) => {
  const { groupId, ...fields } = category;
  return {
    ...fields,
    _type: "menuCategory",
    slug: slug(category.slug),
    group: ref(groupId),
  };
};
const itemDocument = (item) => {
  const { categoryId, ...fields } = item;
  return {
    ...fields,
    _type: "menuItem",
    slug: slug(item.slug),
    category: ref(categoryId),
    isVisible: true,
    isAvailable: true,
    isFeatured: false,
  };
};

let transaction = client.transaction();
transaction = transaction.patch(menu.foodGroup._id, (patch) =>
  patch.set({
    title: menu.foodGroup.title,
    titleEn: menu.foodGroup.titleEn,
    slug: slug(menu.foodGroup.slug),
    order: menu.foodGroup.order,
    isVisible: true,
  }),
);
transaction = transaction.createOrReplace(groupDocument(menu.drinksGroup));

for (const category of menu.categories) {
  if (category._id === "cat-coffee") {
    transaction = transaction.patch(category._id, (patch) =>
      patch
        .set(categoryDocument(category))
        .unset(["description", "descriptionEn"]),
    );
  } else {
    transaction = transaction.createOrReplace(categoryDocument(category));
  }
}

transaction = transaction.patch("cat-matcha", (patch) =>
  patch.set({ group: ref(menu.drinksGroup._id), isVisible: false }),
);

for (const item of menu.items) {
  transaction = transaction.createOrReplace(itemDocument(item));
}

for (const item of menu.existingItemPatches) {
  const { _id, categoryId, ...fields } = item;
  transaction = transaction.patch(_id, (patch) =>
    patch.set({ ...fields, category: ref(categoryId) }),
  );
}

await transaction.commit();
console.log(
  `Populated ${menu.items.length} basic drinks and reorganized the menu in ${projectId}/${dataset}.`,
);
