export type SanityImageAsset = {
  _ref?: string;
  url?: string;
  metadata?: {
    dimensions?: {
      width: number;
      height: number;
    };
  };
};

export type SanityImage = {
  asset?: SanityImageAsset;
  alt?: string;
};

export type SanityRef = {
  _ref: string;
  _type: "reference";
};

export type RestaurantSettings = {
  _id: string;
  name: string;
  logo?: SanityImage;
  decorativeLogo?: SanityImage;
  decorativeLogoText?: string;
  description?: string;
  descriptionEn?: string;
  address?: string;
  mapUrl?: string;
  phone?: string;
  email?: string;
  instagramUrl?: string;
  reservationUrl?: string;
  openingHoursWeekdays?: string;
  openingHoursWeekdaysEn?: string;
  openingHoursWeekend?: string;
  openingHoursWeekendEn?: string;
  brunchHoursWeekdays?: string;
  brunchHoursWeekdaysEn?: string;
  brunchHoursWeekend?: string;
  brunchHoursWeekendEn?: string;
  footerNote?: string;
  footerNoteEn?: string;
  seoTitle?: string;
  seoTitleEn?: string;
  seoDescription?: string;
  seoDescriptionEn?: string;
};

export type MenuGroup = {
  _id: string;
  title: string;
  titleEn?: string;
  slug: string;
  order: number;
  isVisible: boolean;
};

export type MenuCategory = {
  _id: string;
  title: string;
  titleEn?: string;
  slug: string;
  group: SanityRef;
  description?: string;
  descriptionEn?: string;
  order: number;
  isVisible: boolean;
};

export type MenuItem = {
  _id: string;
  name: string;
  nameEn?: string;
  slug: string;
  category: SanityRef;
  description?: string;
  descriptionEn?: string;
  price: string;
  secondaryPrice?: string;
  dietaryLabels?: string[];
  dietaryLabelsEn?: string[];
  badgeLabel?: string;
  badgeLabelEn?: string;
  servingNote?: string;
  servingNoteEn?: string;
  image?: SanityImage;
  imageAlt?: string;
  imageAltEn?: string;
  gallery?: SanityImage[];
  tags?: string[];
  tagsEn?: string[];
  allergens?: string[];
  allergensEn?: string[];
  isVisible: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  order: number;
};

export type MenuPageData = {
  settings: RestaurantSettings;
  groups: MenuGroup[];
  categories: MenuCategory[];
  items: MenuItem[];
};
