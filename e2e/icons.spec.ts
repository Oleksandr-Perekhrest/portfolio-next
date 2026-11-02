// outsource dependencies
import { test, expect } from "@playwright/test";

test.describe("App icons", () => {
    // Icon generation is browser-independent; skip non-chromium projects.
    test.beforeEach(({}, testInfo) => {
        testInfo.skip(
            testInfo.project.name !== "chromium",
            "Icon routes do not depend on the browser engine",
        );
    });

    test("GET /icon returns 200 image/png", async ({ request }) => {
        const response = await request.get("/icon");
        expect(response.status()).toBe(200);
        expect(response.headers()["content-type"]).toContain("image/png");
    });

    test("GET /apple-icon returns 200 image/png", async ({ request }) => {
        const response = await request.get("/apple-icon");
        expect(response.status()).toBe(200);
        expect(response.headers()["content-type"]).toContain("image/png");
    });

    test("GET /en HTML includes icon and apple-touch-icon links", async ({
        request,
    }) => {
        const response = await request.get("/en");
        const body = await response.text();
        expect(body).toMatch(/<link[^>]*rel="icon"[^>]*href="\/icon/);
        expect(body).toMatch(
            /<link[^>]*rel="apple-touch-icon"[^>]*href="\/apple-icon/,
        );
    });

    test("GET /favicon.ico is no longer served", async ({ request }) => {
        const response = await request.get("/favicon.ico");
        // favicon.ico was deleted; Next.js returns 404 for unknown static files.
        expect(response.status()).toBe(404);
    });
});
