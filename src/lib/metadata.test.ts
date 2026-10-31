// outsource dependencies
import { it, expect, describe } from "@jest/globals";

// local dependencies
import { buildAlternates } from "./metadata";

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
