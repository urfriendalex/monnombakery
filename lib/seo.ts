export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://monnombakery.pl",
);

export const siteUpdatedAt = "2026-06-05";

export const siteName = "Mon Nom Bakery";

export const siteDescription =
  "Mon Nom Bakery w Warszawie serwuje sezonowe sniadania, kawe, matcha i wypieki z aktualnym menu online.";

export const menuDescription =
  "Aktualne menu Mon Nom Bakery: sniadania, owsianki, sandwicze, slodkie talerze, kawa i matcha w Warszawie.";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
