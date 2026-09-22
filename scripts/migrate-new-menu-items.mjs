import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-05-21";
const recentNewItemIds = new Set([
  "item-ice-filter",
  "d055801b-a31e-4f25-b784-2c014ec7d0b6",
  "52b90bad-dc8e-40d7-b0a8-bc95a84fe3fe",
  "cf9cecf8-b8cd-433e-b2b2-eda28787ae20",
  "ba54e583-4702-4bf3-b32a-656b9e4ea817",
  "39fdba87-4e65-4f6a-89d7-64e23ff0a4f0",
  "0f79f771-0150-4c0e-8303-78a50bc1d062",
  "7135fbfd-0f14-4d65-80b0-d2249102edd8",
  "item-tropical-matcha",
  "item-ice-matcha-sesame",
  "item-citrus-coffee",
]);

if (!projectId || !token) {
  throw new Error(
    "Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local before migrating new menu items.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const isLegacyNewLabel = (value) =>
  typeof value === "string" && ["new", "nowe"].includes(value.trim().toLowerCase());

const items = await client.fetch(`*[_type == "menuItem"] | order(_updatedAt desc) {
  _id,
  name,
  _updatedAt,
  tags,
  tagsEn,
  badgeLabel,
  badgeLabelEn,
  isNew
}`);

const changes = items.flatMap((item) => {
  const isRecentlyUpdated = recentNewItemIds.has(item._id);
  const hasLegacyNewLabel = [item.badgeLabel, item.badgeLabelEn, ...(item.tags ?? []), ...(item.tagsEn ?? [])].some(
    isLegacyNewLabel,
  );

  if (!isRecentlyUpdated && !hasLegacyNewLabel) {
    return [];
  }

  const nextTags = Array.isArray(item.tags)
    ? item.tags.filter((tag) => !isLegacyNewLabel(tag))
    : undefined;
  const nextTagsEn = Array.isArray(item.tagsEn)
    ? item.tagsEn.filter((tag) => !isLegacyNewLabel(tag))
    : undefined;
  const set = { isNew: true };
  const unset = [];

  if (nextTags) {
    if (nextTags.length) set.tags = nextTags;
    else unset.push("tags");
  }

  if (nextTagsEn) {
    if (nextTagsEn.length) set.tagsEn = nextTagsEn;
    else unset.push("tagsEn");
  }

  if (isLegacyNewLabel(item.badgeLabel)) unset.push("badgeLabel");
  if (isLegacyNewLabel(item.badgeLabelEn)) unset.push("badgeLabelEn");

  return [{ item, isRecentlyUpdated, hasLegacyNewLabel, set, unset }];
});

if (!changes.length) {
  console.log("No menu items require the new-item migration.");
  process.exit(0);
}

let transaction = client.transaction();
for (const change of changes) {
  transaction = transaction.patch(change.item._id, (patch) => {
    let nextPatch = patch.set(change.set);
    if (change.unset.length) nextPatch = nextPatch.unset(change.unset);
    return nextPatch;
  });
}

await transaction.commit();

console.log(`Migrated ${changes.length} menu items in ${projectId}/${dataset}.`);
for (const { item, isRecentlyUpdated, hasLegacyNewLabel } of changes) {
  const reasons = [
    isRecentlyUpdated ? "autumn new-item cohort" : null,
    hasLegacyNewLabel ? "legacy new label" : null,
  ].filter(Boolean);
  console.log(`- ${item.name} (${item._id}): ${reasons.join(", ")}`);
}
