import type { MenuPageData } from "@/types/menu";

export const locales = ["pl", "en"] as const;
export type Locale = (typeof locales)[number];

export const ui = {
  pl: {
    languageName: "Polski",
    alternateLanguage: "English",
    languageSwitchLabel: "Wybierz język",
    homeHeading: "brunch kawa wypieki",
    homeDescription:
      "Sezonowa piekarnia i śniadaniownia z codziennym menu, kawą i rzeczami do zabrania po drodze.",
    quickLinks: "Szybkie linki",
    menuCategories: "Kategorie menu",
    leaveTip: "Zostaw napiwek",
    address: "Adres",
    weekdays: "Dni robocze",
    weekend: "Weekend",
    seasonal: "sezonowe",
    brunches: "brunch",
    openingHours: "Godziny serwowania brunchu",
    photo: "zdjęcie",
    viewPhoto: "Zobacz zdjęcie",
    price: "Cena",
    swipeToHide: "Przesuń w lewo, aby ukryć",
    openPhoto: "Otwórz zdjęcie",
    previousPhoto: "Poprzednie zdjęcie",
    nextPhoto: "Następne zdjęcie",
    closePhoto: "Zamknij podgląd zdjęcia",
    currentMenu: "Aktualne menu",
    menuHeading: "Aktualne menu Mon Nom Bakery w Warszawie",
    homeTitle: "Sezonowe śniadania, kawa i wypieki w Warszawie",
    homeOgTitle: "Mon Nom Bakery — sezonowe śniadania, kawa i wypieki",
    menuTitle: "Aktualne menu",
    faqExpand: "Rozwiń",
    faqCollapse: "Zwiń",
    faqMenuQuestion: "Gdzie sprawdzić aktualne menu Mon Nom Bakery?",
    faqMenuAnswer: "Aktualne dania, ceny i kategorie znajdziesz na stronie",
    faqLocationQuestion: "Gdzie jest Mon Nom Bakery?",
    faqLocationFallback: "Adres lokalu jest podany w sekcji informacyjnej na stronie.",
    faqLocationPrefix: "Mon Nom Bakery znajduje się pod adresem",
    faqDirections: "Zobacz trasę w Google Maps",
    faqNewsQuestion: "Gdzie pojawiają się nowości Mon Nom Bakery?",
    faqNewsAnswer: "Nowe pozycje i aktualności pojawiają się na stronie menu",
    faqNewsInstagram: "oraz na",
  },
  en: {
    languageName: "English",
    alternateLanguage: "Polski",
    languageSwitchLabel: "Choose language",
    homeHeading: "brunch coffee bakes",
    homeDescription:
      "A seasonal bakery and brunch spot with a daily menu, coffee, and good things to take with you.",
    quickLinks: "Quick links",
    menuCategories: "Menu categories",
    leaveTip: "Leave a tip",
    address: "Address",
    weekdays: "Weekdays",
    weekend: "Weekend",
    seasonal: "seasonal",
    brunches: "brunch",
    openingHours: "Brunch serving hours",
    photo: "photo",
    viewPhoto: "View photo",
    price: "Price",
    swipeToHide: "Swipe left to hide",
    openPhoto: "Open photo",
    previousPhoto: "Previous photo",
    nextPhoto: "Next photo",
    closePhoto: "Close photo preview",
    currentMenu: "Current menu",
    menuHeading: "Current Mon Nom Bakery menu in Warsaw",
    homeTitle: "Seasonal brunch, coffee and bakes in Warsaw",
    homeOgTitle: "Mon Nom Bakery — seasonal brunch, coffee and bakes",
    menuTitle: "Current menu",
    faqExpand: "Expand",
    faqCollapse: "Collapse",
    faqMenuQuestion: "Where can I see the current Mon Nom Bakery menu?",
    faqMenuAnswer: "You can find the current dishes, prices and categories on the",
    faqLocationQuestion: "Where is Mon Nom Bakery?",
    faqLocationFallback: "The bakery address is listed in the information section on this page.",
    faqLocationPrefix: "Mon Nom Bakery is located at",
    faqDirections: "Get directions in Google Maps",
    faqNewsQuestion: "Where does Mon Nom Bakery share updates?",
    faqNewsAnswer: "New dishes and updates appear on the menu page",
    faqNewsInstagram: "and on",
  },
} as const;

export function localizedPath(locale: Locale, path: "/" | "/menu") {
  return locale === "en" ? (path === "/" ? "/en" : `/en${path}`) : path;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "pl" ? "en" : "pl";
}

export function localizeMenuPageData(
  data: MenuPageData,
  locale: Locale,
): MenuPageData {
  if (locale === "pl") return data;

  return {
    settings: {
      ...data.settings,
      description: data.settings.descriptionEn ?? data.settings.description,
      openingHoursWeekdays:
        data.settings.openingHoursWeekdaysEn ?? data.settings.openingHoursWeekdays,
      openingHoursWeekend:
        data.settings.openingHoursWeekendEn ?? data.settings.openingHoursWeekend,
      brunchHoursWeekdays:
        data.settings.brunchHoursWeekdaysEn ?? data.settings.brunchHoursWeekdays,
      brunchHoursWeekend:
        data.settings.brunchHoursWeekendEn ?? data.settings.brunchHoursWeekend,
      footerNote: data.settings.footerNoteEn ?? data.settings.footerNote,
      seoTitle: data.settings.seoTitleEn ?? data.settings.seoTitle,
      seoDescription:
        data.settings.seoDescriptionEn ?? data.settings.seoDescription,
    },
    groups: data.groups.map((group) => ({
      ...group,
      title: group.titleEn ?? group.title,
    })),
    categories: data.categories.map((category) => ({
      ...category,
      title: category.titleEn ?? category.title,
      description: category.descriptionEn ?? category.description,
    })),
    items: data.items.map((item) => ({
      ...item,
      name: item.nameEn ?? item.name,
      description: item.descriptionEn ?? item.description,
      dietaryLabels: item.dietaryLabelsEn ?? item.dietaryLabels,
      badgeLabel: item.badgeLabelEn ?? item.badgeLabel,
      servingNote: item.servingNoteEn ?? item.servingNote,
      imageAlt: item.imageAltEn ?? item.imageAlt,
      tags: item.tagsEn ?? item.tags,
      allergens: item.allergensEn ?? item.allergens,
    })),
  };
}
