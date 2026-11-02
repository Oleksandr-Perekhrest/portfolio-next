// outsource dependencies
import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

// Paths and filenames from src/content/cv.ts
const EN_PDF_PATH = "/cv/CV-Perekhrest-Oleksandr-Web-Developer-EN.pdf";
const EN_PDF_FILENAME = "CV-Perekhrest-Oleksandr-Web-Developer-EN.pdf";
const UK_PDF_FILENAME = "CV-Perekhrest-Oleksandr-Web-Developer-UA.pdf";

test.describe("CV", () => {
    test("Download PDF on /en triggers download with the EN filename", async ({
        page,
    }) => {
        await page.goto("/en");
        const [download] = await Promise.all([
            page.waitForEvent("download"),
            page.getByRole("link", { name: "Download PDF" }).click(),
        ]);
        expect(download.suggestedFilename()).toBe(EN_PDF_FILENAME);
        const filePath = await download.path();
        expect(filePath).not.toBeNull();
        expect(readFileSync(filePath!).subarray(0, 4).toString("ascii")).toBe(
            "%PDF",
        );
    });

    test("Download PDF on /uk triggers download with the UA filename", async ({
        page,
    }) => {
        await page.goto("/uk");
        const [download] = await Promise.all([
            page.waitForEvent("download"),
            page.getByRole("link", { name: "Завантажити PDF" }).click(),
        ]);
        expect(download.suggestedFilename()).toBe(UK_PDF_FILENAME);
        const filePath = await download.path();
        expect(filePath).not.toBeNull();
        expect(readFileSync(filePath!).subarray(0, 4).toString("ascii")).toBe(
            "%PDF",
        );
    });

    test("View CV on /en opens a dialog on desktop", async ({
        page,
        context,
        isMobile,
    }) => {
        // Below the tablet breakpoint the link opens a new tab by design
        test.skip(
            isMobile,
            "below the tablet breakpoint the link opens a new tab by design",
        );

        await page.goto("/en");
        await page.getByRole("link", { name: "View CV" }).click();

        // Dialog appears and no new tab was opened
        await expect(page.getByRole("dialog", { name: "CV" })).toBeVisible();
        expect(context.pages()).toHaveLength(1);

        // iframe carries the EN PDF path
        await expect(page.getByTitle("CV")).toHaveAttribute("src", EN_PDF_PATH);

        // Escape closes dialog and returns focus to the trigger link
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).not.toBeVisible();
        await expect(page.getByRole("link", { name: "View CV" })).toBeFocused();
    });

    test("View CV on /en opens a new tab on mobile", async ({
        page,
        context,
        isMobile,
    }) => {
        // Below the tablet breakpoint the link opens a new tab by design
        test.skip(
            !isMobile,
            "below the tablet breakpoint the link opens a new tab by design",
        );

        await page.goto("/en");
        const [newPage] = await Promise.all([
            context.waitForEvent("page"),
            page.getByRole("link", { name: "View CV" }).click(),
        ]);
        // waitForURL waits for the navigation to commit and asserts the URL in one step.
        await newPage.waitForURL(`**${EN_PDF_PATH}`);

        // No dialog on the original page
        await expect(page.getByRole("dialog")).not.toBeVisible();
    });
});
