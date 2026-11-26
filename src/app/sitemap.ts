import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { referenceGroups } from "@/features/client-data-integration/reference";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url },
    { url: `${siteConfig.url}/penyuGallery` },
    { url: `${siteConfig.url}/privacy` },
    { url: `${siteConfig.url}${siteConfig.integrationGuidePath}` },
    ...referenceGroups.flatMap(({ operations }) => operations.map(({ slug }) => ({
      url: `${siteConfig.url}${siteConfig.integrationGuidePath}/${slug}`,
    }))),
  ];
}
