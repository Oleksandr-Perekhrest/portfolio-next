// outsource dependencies
import { test, expect } from "@playwright/test";

const VIEWPORTS = [375, 1280] as const;

test.describe("ProjectGallery", () => {
    test.beforeEach(({}, testInfo) => {
        testInfo.skip(
            testInfo.project.name !== "chromium",
            "Card layout does not depend on the browser engine",
        );
    });

    // ── Card height stability ─────────────────────────────────────────────────

    for (const width of VIEWPORTS) {
        test(`card height is stable across all slides at ${width}px`, async ({
            page,
        }) => {
            await page.setViewportSize({ width, height: 800 });
            await page.goto("/en");

            const card = page.getByTestId("project-gallery");
            const nextBtn = card.getByRole("button", { name: /Next/ });
            const counter = card.locator('[aria-live="polite"]');

            await expect(nextBtn).toBeEnabled();

            const labelText = await counter.textContent();
            const total = Number(labelText?.match(/\/\s*(\d+)/)?.[1] ?? "0");
            expect(total).toBeGreaterThan(1);

            const firstBox = await card.boundingBox();
            expect(firstBox).not.toBeNull();
            const expectedHeight = firstBox?.height ?? 0;

            for (let i = 1; i < total; i++) {
                await nextBtn.click();
                await expect(counter).toContainText(`${i + 1} /`);
                const box = await card.boundingBox();
                expect(box).not.toBeNull();
                expect(
                    Math.abs((box?.height ?? 0) - expectedHeight),
                ).toBeLessThanOrEqual(1);
            }
        });
    }

    // ── Dots x position stability at 1280px ──────────────────────────────────

    test("dots x position is stable across all slides at 1280px", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto("/en");

        const card = page.getByTestId("project-gallery");
        const nextBtn = card.getByRole("button", { name: /Next/ });
        const counter = card.locator('[aria-live="polite"]');

        await expect(nextBtn).toBeEnabled();

        const labelText = await counter.textContent();
        const total = Number(labelText?.match(/\/\s*(\d+)/)?.[1] ?? "0");
        expect(total).toBeGreaterThan(1);

        // Get the visible dots container (inside the active, non-hidden slide).
        // Inactive slides have visibility:hidden, so Playwright's isVisible() returns false for them.
        const allDots = card.locator('[data-testid="gallery-dots"]');
        const getVisibleDots = async () => {
            const count = await allDots.count();
            for (let i = 0; i < count; i++) {
                if (await allDots.nth(i).isVisible()) return allDots.nth(i);
            }
            return allDots.first();
        };

        const firstDots = await getVisibleDots();
        const firstBox = await firstDots.boundingBox();
        expect(firstBox).not.toBeNull();
        const expectedX = firstBox?.x ?? 0;

        for (let i = 1; i < total; i++) {
            await nextBtn.click();
            await expect(counter).toContainText(`${i + 1} /`);
            const dots = await getVisibleDots();
            const box = await dots.boundingBox();
            expect(box).not.toBeNull();
            expect(Math.abs((box?.x ?? 0) - expectedX)).toBeLessThanOrEqual(1);
        }
    });

    // ── First-screen goal ─────────────────────────────────────────────────────

    for (const [vpWidth, vpHeight] of [
        [1280, 900],
        [1440, 900],
    ] as const) {
        test(`Experience grid bottom <= ${vpHeight}px at ${vpWidth}×${vpHeight}`, async ({
            page,
        }) => {
            await page.setViewportSize({ width: vpWidth, height: vpHeight });
            await page.goto("/en");

            // #experience > div selects the grid div (the section's only div child; SectionTitle renders an h2)
            const grid = page.locator("#experience > div");
            const box = await grid.boundingBox();
            expect(box).not.toBeNull();
            const bottom = (box?.y ?? 0) + (box?.height ?? 0);
            // Report the measured value in the test title for diagnostics.
            console.log(
                `${vpWidth}×${vpHeight}: Experience grid bottom = ${bottom.toFixed(1)}px`,
            );
            expect(bottom).toBeLessThanOrEqual(vpHeight);
        });
    }
});
