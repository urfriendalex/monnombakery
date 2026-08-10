import type { MetadataRoute } from "next";

import { absoluteUrl, siteUpdatedAt } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(siteUpdatedAt),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: { pl: absoluteUrl("/"), en: absoluteUrl("/en") } },
    },
    {
      url: absoluteUrl("/menu"),
      lastModified: new Date(siteUpdatedAt),
      changeFrequency: "daily",
      priority: 0.9,
      alternates: { languages: { pl: absoluteUrl("/menu"), en: absoluteUrl("/en/menu") } },
    },
    {
      url: absoluteUrl("/en"),
      lastModified: new Date(siteUpdatedAt),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages: { pl: absoluteUrl("/"), en: absoluteUrl("/en") } },
    },
    {
      url: absoluteUrl("/en/menu"),
      lastModified: new Date(siteUpdatedAt),
      changeFrequency: "daily",
      priority: 0.8,
      alternates: { languages: { pl: absoluteUrl("/menu"), en: absoluteUrl("/en/menu") } },
    },
  ];
}
