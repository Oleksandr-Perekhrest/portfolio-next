// outsource dependencies
import { test, expect } from "@playwright/test";

test.describe("theme switch – dark system preference", () => {
    test.use({ colorScheme: "dark" });

    test("data-theme=dark and switch is checked", async ({ page }) => {
        await page.goto("/en");
        await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            "dark",
        );
        await expect(
            page.getByRole("switch", { name: "Dark theme" }),
        ).toBeChecked();
    });
});

test.describe("theme switch – light system preference", () => {
    test.use({ colorScheme: "light" });

    test("data-theme=light and switch is unchecked", async ({ page }) => {
        await page.goto("/en");
        await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            "light",
        );
        await expect(
            page.getByRole("switch", { name: "Dark theme" }),
        ).not.toBeChecked();
    });

    test("toggling to dark persists across page reload", async ({ page }) => {
        await page.goto("/en");
        await page.getByRole("switch", { name: "Dark theme" }).click();
        await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            "dark",
        );
        await expect(
            page.getByRole("switch", { name: "Dark theme" }),
        ).toBeChecked();
        await page.reload();
        await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            "dark",
        );
        await expect(
            page.getByRole("switch", { name: "Dark theme" }),
        ).toBeChecked();
    });

    test("switching locale does not reset dark theme", async ({ page }) => {
        await page.goto("/en");
        await page.getByRole("switch", { name: "Dark theme" }).click();
        await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            "dark",
        );

        await page
            .getByRole("navigation", { name: "Language" })
            .getByRole("link", { name: "Українська", exact: true })
            .click();

        await expect(page).toHaveURL(/\/uk/);
        await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            "dark",
        );
    });
});
