// outsource dependencies
import { test, expect } from "@playwright/test";

test.describe("contact dialog", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/en");
        const emailMeBtn = page.getByRole("button", { name: "Email me" });
        await emailMeBtn.scrollIntoViewIfNeeded();
        await emailMeBtn.click();
        await expect(page.getByRole("dialog")).toBeVisible();
        // Radix Dialog focuses the first focusable element (Close button)
        await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
    });

    test("Escape closes dialog and returns focus to trigger", async ({
        page,
    }) => {
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).not.toBeVisible();
        await expect(
            page.getByRole("button", { name: "Email me" }),
        ).toBeFocused();
    });

    test("Close button closes dialog and returns focus to trigger", async ({
        page,
    }) => {
        await page.getByRole("button", { name: "Close" }).click();
        await expect(page.getByRole("dialog")).not.toBeVisible();
        await expect(
            page.getByRole("button", { name: "Email me" }),
        ).toBeFocused();
    });

    test("clicking dimmed backdrop closes dialog", async ({ page }) => {
        const box = await page.getByRole("dialog").boundingBox();
        expect(box).not.toBeNull();
        const clickX = 10;
        const clickY = 10;
        // Verify the chosen point is outside the dialog panel's bounding box
        expect(
            clickX < box!.x ||
                clickX > box!.x + box!.width ||
                clickY < box!.y ||
                clickY > box!.y + box!.height,
        ).toBe(true);
        await page.mouse.click(clickX, clickY);
        await expect(page.getByRole("dialog")).not.toBeVisible();
    });

    test("page does not scroll while dialog is open", async ({ page }) => {
        const scrollYBefore = await page.evaluate(() => window.scrollY);
        await page.mouse.wheel(0, 500);
        await expect
            .poll(() => page.evaluate(() => window.scrollY))
            .toBe(scrollYBefore);
    });
});
