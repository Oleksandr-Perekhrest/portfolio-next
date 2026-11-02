// outsource dependencies
import { test, expect } from "@playwright/test";

test.describe("locale switch – uk-UA browser", () => {
    test.use({ locale: "uk-UA" });

    test("/ redirects to /uk", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveURL(/\/uk($|\/|\?|#)/);
    });
});

test.describe("locale switch", () => {
    test("clicking Українська on /en switches to /uk with correct content", async ({
        page,
    }) => {
        await page.goto("/en");

        await page
            .getByRole("navigation", { name: "Language" })
            .getByRole("link", { name: "Українська", exact: true })
            .click();

        await expect(page).toHaveURL(/\/uk/);
        await expect(page.locator("html")).toHaveAttribute("lang", "uk");

        const mainNav = page.getByRole("navigation", { name: "Основна" });
        await expect(
            mainNav.getByRole("link", { name: "Досвід", exact: true }),
        ).toBeVisible();
        await expect(
            mainNav.getByRole("link", { name: "Про мене", exact: true }),
        ).toBeVisible();
        await expect(
            mainNav.getByRole("link", { name: "Контакти", exact: true }),
        ).toBeVisible();

        await expect(
            page
                .getByRole("navigation", { name: "Мова" })
                .getByRole("link", { name: "Українська", exact: true }),
        ).toHaveAttribute("aria-current", "true");
    });

    test.describe("with reduced motion", () => {
        test.use({ reducedMotion: "reduce" });

        test("Українська follows plain link on /en, switching back to English works", async ({
            page,
        }) => {
            await page.goto("/en");

            await page
                .getByRole("navigation", { name: "Language" })
                .getByRole("link", { name: "Українська", exact: true })
                .click();

            await expect(page).toHaveURL(/\/uk/);
            await expect(page.locator("html")).toHaveAttribute("lang", "uk");
            await expect(
                page
                    .getByRole("navigation", { name: "Мова" })
                    .getByRole("link", { name: "Українська", exact: true }),
            ).toHaveAttribute("aria-current", "true");

            await page
                .getByRole("navigation", { name: "Мова" })
                .getByRole("link", { name: "English", exact: true })
                .click();

            await expect(page).toHaveURL(/\/en/);
            await expect(page.locator("html")).toHaveAttribute("lang", "en");
        });
    });
});
