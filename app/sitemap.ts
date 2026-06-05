import type { MetadataRoute } from "next";

import { absoluteUrl, siteUpdatedAt } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(siteUpdatedAt),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/menu"),
      lastModified: new Date(siteUpdatedAt),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
