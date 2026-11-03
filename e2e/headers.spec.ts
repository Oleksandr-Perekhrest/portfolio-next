// outsource dependencies
import { test, expect } from "@playwright/test";

// CV PDF path — from src/content/cv.ts (en locale)
const EN_PDF_PATH = "/cv/CV-Perekhrest-Oleksandr-Web-Engineer-EN.pdf";

test.describe("Security headers", () => {
    // Headers are browser-independent; running in all projects would triple
    // the build time with no additional coverage.
    test.beforeEach(({}, testInfo) => {
        testInfo.skip(
            testInfo.project.name !== "chromium",
            "Headers do not depend on the browser engine",
        );
    });

    test("GET /en returns all four security headers", async ({ request }) => {
        const response = await request.get("/en");
        expect(response.headers()["x-content-type-options"]).toBe("nosniff");
        expect(response.headers()["referrer-policy"]).toBe(
            "strict-origin-when-cross-origin",
        );
        expect(response.headers()["x-frame-options"]).toBe("SAMEORIGIN");
        expect(response.headers()["permissions-policy"]).toBe(
            "camera=(), microphone=(), geolocation=(), browsing-topics=()",
        );
    });

    test("GET CV PDF returns all four security headers", async ({
        request,
    }) => {
        const response = await request.get(EN_PDF_PATH);
        expect(response.headers()["x-content-type-options"]).toBe("nosniff");
        expect(response.headers()["referrer-policy"]).toBe(
            "strict-origin-when-cross-origin",
        );
        expect(response.headers()["x-frame-options"]).toBe("SAMEORIGIN");
        expect(response.headers()["permissions-policy"]).toBe(
            "camera=(), microphone=(), geolocation=(), browsing-topics=()",
        );
    });
});
