import photoManifest from "@/public/menu/photos/manifest.json";
import type { MenuItem } from "@/types/menu";

type PhotoManifestEntry = {
  primary: string;
  alternates?: string[];
};

const manifestItems = photoManifest.items as Record<string, PhotoManifestEntry>;

export function getMenuPhotoUrl(slug: string) {
  return manifestItems[slug]?.primary;
}

export function applyMenuPhotoManifest(items: MenuItem[]) {
  return items.map((item) => {
    const photoUrl = getMenuPhotoUrl(item.slug);

    if (!photoUrl) {
      return item;
    }

    return {
      ...item,
      image: {
        ...item.image,
        asset: {
          ...item.image?.asset,
          url: photoUrl,
        },
      },
    };
  });
}
