// outsource dependencies
import { test, expect } from "@playwright/test";

test.describe("skip link", () => {
    test("Tab focuses skip link and it appears in viewport; Enter moves focus to main", async ({
        page,
    }) => {
        await page.goto("/en");
        const skipLink = page.getByRole("link", { name: "Skip to content" });

        await page.keyboard.press("Tab");
        await expect(skipLink).toBeFocused();
        // After :focus-visible the element gets position:fixed with real dimensions;
        // verify it escaped the 1×1 visually-hidden state.
        const box = await skipLink.boundingBox();
        expect(box!.width).toBeGreaterThan(10);
        expect(box!.height).toBeGreaterThan(10);

        await page.keyboard.press("Enter");
        await expect(page.getByRole("main")).toBeFocused();
    });
});
