// outsource dependencies
import { it, expect, describe } from "@jest/globals";

// local dependencies
import { buildAlternates, buildSitemapEntries } from "./metadata";

const LOCALES = ["en", "uk"] as const;

describe("buildAlternates", () => {
    it("sets canonical to /en for en locale", () => {
        expect(buildAlternates("en", LOCALES).canonical).toBe("/en");
    });

    it("sets canonical to /uk for uk locale", () => {
        expect(buildAlternates("uk", LOCALES).canonical).toBe("/uk");
    });

    it("includes a language entry for every locale", () => {
        const { languages } = buildAlternates("en", LOCALES);
        expect(languages).toMatchObject({ en: "/en", uk: "/uk" });
    });

    it("includes x-default pointing to /", () => {
        const { languages } = buildAlternates("en", LOCALES);
        expect(languages["x-default"]).toBe("/");
    });

    it("is locale-agnostic — uk produces same languages map", () => {
        const { languages } = buildAlternates("uk", LOCALES);
        expect(languages).toMatchObject({
            en: "/en",
            uk: "/uk",
            "x-default": "/",
        });
    });
});

describe("buildSitemapEntries", () => {
    const SITE_URL = "https://example.test";

    it("returns one entry per locale with absolute url", () => {
        const entries = buildSitemapEntries(SITE_URL, LOCALES);
        expect(entries.map((e) => e.url)).toEqual([
            "https://example.test/en",
            "https://example.test/uk",
        ]);
    });

    it("each entry's alternates.languages equals the full absolute map", () => {
        const entries = buildSitemapEntries(SITE_URL, LOCALES);
        const expected = {
            "x-default": "https://example.test/",
            en: "https://example.test/en",
            uk: "https://example.test/uk",
        };
        for (const entry of entries) {
            expect(entry.alternates?.languages).toEqual(expected);
        }
    });

    it("sitemap languages match buildAlternates paths prefixed with siteUrl", () => {
        const entries = buildSitemapEntries(SITE_URL, LOCALES);
        entries.forEach((entry, i) => {
            const { languages } = buildAlternates(LOCALES[i]!, LOCALES);
            const expected = Object.fromEntries(
                Object.entries(languages).map(([k, v]) => [
                    k,
                    `${SITE_URL}${v}`,
                ]),
            );
            expect(entry.alternates?.languages).toEqual(expected);
        });
    });
});
