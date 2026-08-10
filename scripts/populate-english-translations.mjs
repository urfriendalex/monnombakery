import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-05-21";

if (!projectId || !token) {
  throw new Error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local before populating translations.");
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const translations = JSON.parse(
  readFileSync(path.join(rootDir, "content/english-translations.json"), "utf8"),
);
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const existingIds = new Set(await client.fetch(`*[_id in $ids]._id`, { ids: Object.keys(translations) }));
const missingIds = Object.keys(translations).filter((id) => !existingIds.has(id));

if (missingIds.length) {
  throw new Error(`Cannot populate translations; missing Sanity documents: ${missingIds.join(", ")}`);
}

let transaction = client.transaction();
for (const [id, fields] of Object.entries(translations)) {
  transaction = transaction.patch(id, (patch) => patch.set(fields));
}

await transaction.commit();
console.log(`Populated English fields on ${Object.keys(translations).length} Sanity documents in ${projectId}/${dataset}.`);
