// outsource dependencies
import { test, expect } from "@playwright/test";

test.describe("navigation", () => {
    test("/ redirects to /en for en-US browser", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveURL(/\/en($|\/|\?|#)/);
    });

    test("Experience link scrolls to #experience section", async ({ page }) => {
        await page.goto("/en");
        await page.getByRole("link", { name: "Experience" }).click();
        await expect(page).toHaveURL(/#experience$/);
        await expect(page.locator("#experience")).toBeInViewport();
    });

    test("About link scrolls to #about section", async ({ page }) => {
        await page.goto("/en");
        await page.getByRole("link", { name: "About" }).click();
        await expect(page).toHaveURL(/#about$/);
        await expect(page.locator("#about")).toBeInViewport();
    });

    test("Contact link scrolls to #contact section", async ({ page }) => {
        await page.goto("/en");
        await page.getByRole("link", { name: "Contact" }).click();
        await expect(page).toHaveURL(/#contact$/);
        await expect(page.locator("#contact")).toBeInViewport();
    });

    test("brand link returns to top of page", async ({ page }) => {
        await page.goto("/en#contact");
        await page.getByRole("link", { name: "Oleksandr Perekhrest" }).click();
        await expect(page).toHaveURL(/\/en#top$/);
        // smooth-scroll: wait for animation to settle rather than checking immediately
        await page.waitForFunction(() => window.scrollY === 0);
    });
});
