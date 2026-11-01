// outsource dependencies
import fs from "fs";
import path from "path";
import { it, expect, describe } from "@jest/globals";

// local dependencies
import { getCvPath } from "./cv";
import { routing } from "@/i18n/routing";

describe("cv paths", () => {
    it("every locale has a path starting with /cv/ and ending with .pdf", () => {
        for (const locale of routing.locales) {
            const p = getCvPath(locale);
            expect(p).toMatch(/^\/cv\//);
            expect(p).toMatch(/\.pdf$/);
        }
    });

    it("every locale PDF exists in public/", () => {
        for (const locale of routing.locales) {
            const p = getCvPath(locale);
            const fullPath = path.join(process.cwd(), "public", p);
            expect(fs.existsSync(fullPath)).toBe(true);
        }
    });
});
