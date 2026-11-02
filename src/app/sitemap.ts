// outsource dependencies
import type { MetadataRoute } from "next";

// local dependencies
import { siteUrl } from "@/lib/site";
import { routing } from "@/i18n/routing";
import { buildSitemapUrl } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
    const xDefault = buildSitemapUrl(siteUrl, routing.defaultLocale);
    const allLanguages = Object.fromEntries([
        ["x-default", xDefault],
        ...routing.locales.map((l) => [l, buildSitemapUrl(siteUrl, l)]),
    ]);

    return routing.locales.map((locale) => ({
        url: buildSitemapUrl(siteUrl, locale),
        alternates: { languages: allLanguages },
    }));
}
