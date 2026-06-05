import { createClient } from "@sanity/client";
import { createReadStream, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-05-21";

if (!projectId || !token) {
  throw new Error(
    "Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local before seeding.",
  );
}

const ref = (_ref) => ({ _type: "reference", _ref });
const slug = (current) => ({ _type: "slug", current });
const imageRef = (_ref) => ({ _type: "image", asset: { _type: "reference", _ref } });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const photoManifest = JSON.parse(
  readFileSync(path.join(rootDir, "public/menu/photos/manifest.json"), "utf8"),
);

const documents = [
  {
    _id: "restaurant-settings",
    _type: "restaurantSettings",
    name: "mon nom",
    description: "Bakery, śniadania, kawa.",
    address: "Poznańska 13, 00-680 Warszawa",
    mapUrl: "https://maps.app.goo.gl/Fo9i1xuErkMAw6e66?g_st=ic",
    instagramUrl: "https://www.instagram.com/monnom_bakery?igsh=MW5kMHBnaGJwNXljbw==",
    openingHoursWeekdays: "8:30 - 18:00",
    openingHoursWeekend: "9:00 - 18:00",
    brunchHoursWeekdays: "10:00 - 15:00",
    brunchHoursWeekend: "9:00 - 15:00",
    footerNote: "Zamówienie można złożyć przy kasie",
    seoTitle: "Mon Nom Bakery Menu",
    seoDescription: "Minimalne menu śniadaniowe Mon Nom Bakery.",
  },
  { _id: "group-breakfast", _type: "menuGroup", title: "Menu", slug: slug("menu"), order: 1, isVisible: true },
  { _id: "cat-breakfast", _type: "menuCategory", title: "Śniadania", slug: slug("sniadania"), group: ref("group-breakfast"), order: 1, isVisible: true },
  { _id: "cat-porridge", _type: "menuCategory", title: "Owsianki", slug: slug("owsianki"), group: ref("group-breakfast"), order: 2, isVisible: true },
  { _id: "cat-sandwiches", _type: "menuCategory", title: "Sandwicze", slug: slug("sandwicze"), group: ref("group-breakfast"), order: 3, isVisible: true },
  { _id: "cat-plates", _type: "menuCategory", title: "Talerze", slug: slug("talerze"), group: ref("group-breakfast"), order: 4, isVisible: true },
  { _id: "cat-sweet", _type: "menuCategory", title: "Słodkie", slug: slug("slodkie"), group: ref("group-breakfast"), order: 5, isVisible: true },
  { _id: "cat-coffee", _type: "menuCategory", title: "Kawa", slug: slug("kawa"), group: ref("group-breakfast"), order: 6, isVisible: true },
  { _id: "cat-matcha", _type: "menuCategory", title: "Matcha", slug: slug("matcha"), group: ref("group-breakfast"), order: 7, isVisible: true },
  { _id: "item-mortadela", _type: "menuItem", name: "Śniadanie Mortadela", slug: slug("sniadanie-mortadela"), category: ref("cat-breakfast"), description: "chleb, jajecznica, ser, mortadela, dżem, masło, sałatka", price: "33", isVisible: true, isAvailable: true, isFeatured: false, order: 1 },
  { _id: "item-losos", _type: "menuItem", name: "Śniadanie Łosoś", slug: slug("sniadanie-losos"), category: ref("cat-breakfast"), description: "chleb, jajecznica, awokado, łosoś, dżem, masło, sałatka", price: "39", tags: ["nowe"], isVisible: true, isAvailable: true, isFeatured: true, order: 2 },
  { _id: "item-owsianka-mortadela", _type: "menuItem", name: "Owsianka Mortadela & Jajko", slug: slug("owsianka-mortadela-jajko"), category: ref("cat-porridge"), description: "owsianka z sosem sojowym i pastą orzechową, mortadela, jajko", price: "30", isVisible: true, isAvailable: true, isFeatured: false, order: 1 },
  { _id: "item-owsianka-losos", _type: "menuItem", name: "Owsianka Awokado & Łosoś", slug: slug("owsianka-awokado-losos"), category: ref("cat-porridge"), description: "owsianka z sosem sojowym i pastą orzechową, awokado, łosoś", price: "36", isVisible: true, isAvailable: true, isFeatured: false, order: 2 },
  { _id: "item-roastbeef", _type: "menuItem", name: "Sandwicz z rostbefem", slug: slug("sandwicz-z-rostbefem"), category: ref("cat-sandwiches"), description: "chleb pszenno-żytni, majonez miso, sałata, roastbeef, cebula", price: "34", isVisible: true, isAvailable: true, isFeatured: false, order: 1 },
  { _id: "item-indyk", _type: "menuItem", name: "Sandwicz z indykiem", slug: slug("sandwicz-z-indykiem"), category: ref("cat-sandwiches"), description: "ciabatta, jajecznica, indyk, sałata", price: "32", isVisible: true, isAvailable: true, isFeatured: false, order: 2 },
  { _id: "item-talerz", _type: "menuItem", name: "Talerz jajko i ser", slug: slug("talerz-jajko-i-ser"), category: ref("cat-plates"), price: "25", isVisible: true, isAvailable: true, isFeatured: false, order: 1 },
  { _id: "item-syrniki-chalwa", _type: "menuItem", name: "Syrniki z chałwą", slug: slug("syrniki-z-chalwa"), category: ref("cat-sweet"), description: "słodki twaróg, chałwa, malina, mleko zagęszczone, śmietana", price: "34", isVisible: true, isAvailable: true, isFeatured: false, order: 1 },
  { _id: "item-syrniki-ogorek", _type: "menuItem", name: "Syrniki z salsą ogórkową", slug: slug("syrniki-z-salsa-ogorkowa"), category: ref("cat-sweet"), description: "solony twaróg, salsa ogórkowa, kolendra, śmietana", price: "29", isVisible: true, isAvailable: true, isFeatured: false, order: 2 },
  { _id: "item-espresso-tonic", _type: "menuItem", name: "Espresso Tonic", slug: slug("espresso-tonic"), category: ref("cat-coffee"), price: "22", isVisible: true, isAvailable: true, isFeatured: false, order: 1 },
  { _id: "item-citrus-coffee", _type: "menuItem", name: "Citrus Coffee", slug: slug("citrus-coffee"), category: ref("cat-coffee"), price: "27", isVisible: true, isAvailable: true, isFeatured: false, order: 2 },
  { _id: "item-filter-tonic", _type: "menuItem", name: "Filter Tonic", slug: slug("filter-tonic"), category: ref("cat-coffee"), price: "22", isVisible: true, isAvailable: true, isFeatured: false, order: 3 },
  { _id: "item-ice-filter", _type: "menuItem", name: "Ice Filter", slug: slug("ice-filter"), category: ref("cat-coffee"), price: "19", isVisible: true, isAvailable: true, isFeatured: false, order: 4 },
  { _id: "item-ice-latte-sesame", _type: "menuItem", name: "Ice Latte Sesame", slug: slug("ice-latte-sesame"), category: ref("cat-coffee"), price: "27", isVisible: true, isAvailable: true, isFeatured: false, order: 5 },
  { _id: "item-tropical-matcha", _type: "menuItem", name: "Tropical Matcha", slug: slug("tropical-matcha"), category: ref("cat-matcha"), price: "28", isVisible: true, isAvailable: true, isFeatured: false, order: 1 },
  { _id: "item-ice-matcha-latte", _type: "menuItem", name: "Ice Matcha Latte", slug: slug("ice-matcha-latte"), category: ref("cat-matcha"), price: "22", isVisible: true, isAvailable: true, isFeatured: false, order: 2 },
  { _id: "item-matcha-tonic", _type: "menuItem", name: "Matcha Tonic", slug: slug("matcha-tonic"), category: ref("cat-matcha"), price: "20", isVisible: true, isAvailable: true, isFeatured: false, order: 3 },
  { _id: "item-ice-matcha-sesame", _type: "menuItem", name: "Ice Matcha Sesame", slug: slug("ice-matcha-sesame"), category: ref("cat-matcha"), price: "28", isVisible: true, isAvailable: true, isFeatured: false, order: 4 },
];

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

async function uploadImageAsset(publicPath, title) {
  const filePath = path.join(rootDir, "public", publicPath.replace(/^\//, ""));
  return client.assets.upload("image", createReadStream(filePath), {
    filename: path.basename(filePath),
    title,
  });
}

async function attachMenuImages(document) {
  if (document._type !== "menuItem" || !document.slug?.current) {
    return document;
  }

  const manifestEntry = photoManifest.items?.[document.slug.current];
  if (!manifestEntry?.primary) {
    return document;
  }

  const primaryAsset = await uploadImageAsset(manifestEntry.primary, document.name);
  const alternateAssets = await Promise.all(
    (manifestEntry.alternates ?? []).map((alternatePath, index) =>
      uploadImageAsset(alternatePath, `${document.name} alternate ${index + 1}`),
    ),
  );

  return {
    ...document,
    image: imageRef(primaryAsset._id),
    gallery: alternateAssets.map((asset) => imageRef(asset._id)),
  };
}

const seededDocuments = await Promise.all(documents.map(attachMenuImages));

let transaction = client.transaction();
for (const document of seededDocuments) {
  transaction = transaction.createOrReplace(document);
}

await transaction.commit();
console.log(`Seeded ${seededDocuments.length} Sanity documents into ${projectId}/${dataset}.`);
