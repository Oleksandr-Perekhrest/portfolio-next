// outsource dependencies
import { test, expect } from "@playwright/test";

const NAV_LINKS = [
    { name: "About", id: "about" },
    { name: "Contact", id: "contact" },
    { name: "Experience", id: "experience" },
] as const;

test.describe("navigation", () => {
    test("/ redirects to /en for en-US browser", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveURL(/\/en($|\/|\?|#)/);
    });

    for (const { name, id } of NAV_LINKS) {
        test(`${name} link scrolls to #${id} and activates scroll-spy`, async ({
            page,
        }) => {
            await page.goto("/en");
            const nav = page.getByRole("navigation", { name: "Main" });
            const link = nav.getByRole("link", { name, exact: true });

            await link.click();

            await expect(page).toHaveURL(new RegExp(`#${id}$`));
            await expect(link).toHaveAttribute("aria-current", "location");
            for (const other of NAV_LINKS.filter((l) => l.id !== id)) {
                await expect(
                    nav.getByRole("link", { name: other.name, exact: true }),
                ).not.toHaveAttribute("aria-current", "location");
            }
            await expect(page.locator(`#${id}`)).toBeInViewport();
        });
    }

    test("brand link returns to top of page", async ({ page }) => {
        await page.goto("/en");
        // instant scroll avoids a smooth-scroll race on mobile when using hash nav
        await page.evaluate(() =>
            window.scrollTo({ top: 1500, behavior: "instant" }),
        );
        await expect
            .poll(() => page.evaluate(() => window.scrollY), {
                message: "page must be scrolled down before clicking brand",
            })
            .toBeGreaterThan(0);
        await page.getByRole("link", { name: "Oleksandr Perekhrest" }).click();
        await expect(page).toHaveURL(/\/en#top$/);
        // smooth-scroll: wait for animation to settle rather than checking immediately
        await page.waitForFunction(() => window.scrollY === 0);
    });
});
