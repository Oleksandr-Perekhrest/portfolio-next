// outsource dependencies
import { test, expect } from "@playwright/test";

const VIEWPORTS = [375, 1280] as const;

test.describe("CommercialGallery height stability", () => {
    test.beforeEach(({}, testInfo) => {
        testInfo.skip(
            testInfo.project.name !== "chromium",
            "Card layout does not depend on the browser engine",
        );
    });

    for (const width of VIEWPORTS) {
        test(`card height is stable for all items at ${width}px`, async ({
            page,
        }) => {
            await page.setViewportSize({ width, height: 800 });
            await page.goto("/en");

            const card = page.getByTestId("commercial-card");
            const nextBtn = card.getByRole("button", { name: "Next" });
            const counterLabel = card.locator('[aria-live="polite"]');

            // Ensure the client component has hydrated before measuring.
            await expect(nextBtn).toBeEnabled();

            // Derive total from the counter label: "Commercial · 1 / 3"
            const labelText = await counterLabel.textContent();
            const total = Number(labelText?.match(/\/\s*(\d+)/)?.[1] ?? "0");
            expect(total).toBeGreaterThan(1);

            const firstBox = await card.boundingBox();
            expect(firstBox).not.toBeNull();
            const expectedHeight = firstBox!.height;

            for (let i = 1; i < total; i++) {
                await nextBtn.click();
                await expect(counterLabel).toContainText(`${i + 1} / ${total}`);
                const box = await card.boundingBox();
                expect(
                    Math.abs(box!.height - expectedHeight),
                ).toBeLessThanOrEqual(1);
            }
        });
    }
});
