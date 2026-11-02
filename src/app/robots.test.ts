// outsource dependencies
import { it, expect, describe } from "@jest/globals";

// local dependencies
import robots from "./robots";
import { siteUrl } from "@/lib/site";

describe("robots", () => {
    it("allows / for all user agents and points sitemap to siteUrl", () => {
        const result = robots();
        expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
        expect(result.sitemap).toBe(`${siteUrl}/sitemap.xml`);
    });
});
