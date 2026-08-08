export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://monnombakery.pl",
);

export const siteUpdatedAt = "2026-08-08";

export const siteName = "Mon Nom Bakery";

export const siteDescription =
  "Mon Nom Bakery w Warszawie serwuje sezonowe sniadania, kawe, matcha i wypieki z aktualnym menu online.";

export const menuDescription =
  "Aktualne menu Mon Nom Bakery: sniadania, owsianki, sandwicze, slodkie talerze, kawa i matcha w Warszawie.";

export const siteDescriptionEn =
  "Mon Nom Bakery in Warsaw serves seasonal brunch, coffee, matcha and fresh bakes, with the current menu available online.";

export const menuDescriptionEn =
  "The current Mon Nom Bakery menu: breakfasts, savoury porridge, sandwiches, sweet plates, coffee and matcha in Warsaw.";

export function siteDescriptionFor(locale: "pl" | "en") {
  return locale === "en" ? siteDescriptionEn : siteDescription;
}

export function menuDescriptionFor(locale: "pl" | "en") {
  return locale === "en" ? menuDescriptionEn : menuDescription;
}

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
