// outsource dependencies
import type { MetadataRoute } from "next";

// local dependencies
import { siteUrl } from "@/lib/site";
import { routing } from "@/i18n/routing";
import { buildSitemapEntries } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
    return buildSitemapEntries(siteUrl, routing.locales);
}
