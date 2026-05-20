import type { SanityImage } from "@/types/menu";

export function imageUrlFor(image?: SanityImage, width = 1200) {
  if (!image?.asset) {
    return null;
  }

  if (image.asset.url) {
    return image.asset.url;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const ref = image.asset._ref;

  if (!projectId || !ref) {
    return null;
  }

  const [, id, dimensions, extension] = ref.split("-");

  if (!id || !dimensions || !extension) {
    return null;
  }

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${extension}?w=${width}&auto=format&fit=max`;
}
