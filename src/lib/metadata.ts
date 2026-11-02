// outsource dependencies
import type { MetadataRoute } from "next";

export const ogLocaleMap: Record<string, string> = {
    en: "en_US",
    uk: "uk_UA",
};

export function buildAlternates(locale: string, locales: readonly string[]) {
    const languages: Record<string, string> = { "x-default": "/" };
    for (const l of locales) {
        languages[l] = `/${l}`;
    }
    return { canonical: `/${locale}`, languages };
}

export function buildSitemapEntries(
    siteUrl: string,
    locales: readonly string[],
): MetadataRoute.Sitemap {
    return locales.map((locale) => {
        const { canonical, languages } = buildAlternates(locale, locales);
        return {
            url: `${siteUrl}${canonical}`,
            alternates: {
                languages: Object.fromEntries(
                    Object.entries(languages).map(([k, v]) => [
                        k,
                        `${siteUrl}${v}`,
                    ]),
                ),
            },
        };
    });
}
