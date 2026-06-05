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
  address?: string;
  mapUrl?: string;
  phone?: string;
  email?: string;
  instagramUrl?: string;
  reservationUrl?: string;
  openingHoursWeekdays?: string;
  openingHoursWeekend?: string;
  brunchHoursWeekdays?: string;
  brunchHoursWeekend?: string;
  footerNote?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type MenuGroup = {
  _id: string;
  title: string;
  slug: string;
  order: number;
  isVisible: boolean;
};

export type MenuCategory = {
  _id: string;
  title: string;
  slug: string;
  group: SanityRef;
  description?: string;
  order: number;
  isVisible: boolean;
};

export type MenuItem = {
  _id: string;
  name: string;
  slug: string;
  category: SanityRef;
  description?: string;
  price: string;
  secondaryPrice?: string;
  dietaryLabels?: string[];
  badgeLabel?: string;
  servingNote?: string;
  image?: SanityImage;
  imageAlt?: string;
  gallery?: SanityImage[];
  tags?: string[];
  allergens?: string[];
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
