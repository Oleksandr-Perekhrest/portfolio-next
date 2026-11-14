// outsource dependencies
import { test, expect, type Page, type Locator } from "@playwright/test";

test.describe("TechCloud", () => {
    test.beforeEach(({}, testInfo) => {
        testInfo.skip(
            testInfo.project.name !== "chromium",
            "Cloud layout does not depend on the browser engine",
        );
    });

    // ── Helpers ───────────────────────────────────────────────────────────────

    async function openCloud(
        page: Page,
        area: "Frontend" | "Backend",
    ): Promise<Locator> {
        await page.goto("/en");
        await page
            .getByRole("button", { name: `Show all ${area} technologies` })
            .click();
        return page.getByRole("dialog");
    }

    function getList(dialog: Locator, area: "Frontend" | "Backend"): Locator {
        return dialog.locator(`ul[aria-label="${area} technologies"]`);
    }

    type Box = { x: number; y: number; width: number; height: number };

    async function getItemBoxes(list: Locator): Promise<Box[]> {
        const items = list.locator("li");
        const count = await items.count();
        const boxes: Box[] = [];
        for (let i = 0; i < count; i++) {
            const box = await items.nth(i).boundingBox();
            if (box !== null) boxes.push(box);
        }
        return boxes;
    }

    function checkNoOverlap(boxes: Box[]): void {
        for (let i = 0; i < boxes.length; i++) {
            for (let j = i + 1; j < boxes.length; j++) {
                const a = boxes[i] as Box;
                const b = boxes[j] as Box;
                const overlaps =
                    a.x < b.x + b.width &&
                    a.x + a.width > b.x &&
                    a.y < b.y + b.height &&
                    a.y + a.height > b.y;
                expect(
                    overlaps,
                    `items ${i} and ${j} overlap: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`,
                ).toBe(false);
            }
        }
    }

    // ── Desktop layout (1280×900) ─────────────────────────────────────────────

    for (const area of ["Frontend", "Backend"] as const) {
        test(`${area}: no overlaps, all inside body, none in header row`, async ({
            page,
        }) => {
            await page.setViewportSize({ width: 1280, height: 900 });
            const dialog = await openCloud(page, area);
            const list = getList(dialog, area);

            await expect(list).toHaveAttribute("data-cloud-state", "measured");

            const items = list.locator("li");
            const count = await items.count();
            expect(count).toBeGreaterThan(0);

            const itemBoxes = await getItemBoxes(list);
            expect(itemBoxes.length).toBe(count);

            checkNoOverlap(itemBoxes);

            // All items fully inside the body element (the div that wraps the list).
            const bodyEl = list.locator("xpath=..");
            const bodyBox = await bodyEl.boundingBox();
            expect(bodyBox).not.toBeNull();
            for (const box of itemBoxes) {
                expect(box.x).toBeGreaterThanOrEqual((bodyBox as Box).x - 1);
                expect(box.y).toBeGreaterThanOrEqual((bodyBox as Box).y - 1);
                expect(box.x + box.width).toBeLessThanOrEqual(
                    (bodyBox as Box).x + (bodyBox as Box).width + 1,
                );
                expect(box.y + box.height).toBeLessThanOrEqual(
                    (bodyBox as Box).y + (bodyBox as Box).height + 1,
                );
            }

            // None intersect the header row (title + Close button).
            const closeBtn = dialog.getByRole("button", { name: "Close" });
            const closeBtnBox = await closeBtn.boundingBox();
            expect(closeBtnBox).not.toBeNull();
            const headerBottom =
                (closeBtnBox as Box).y + (closeBtnBox as Box).height;
            for (const box of itemBoxes) {
                expect(box.y).toBeGreaterThanOrEqual(headerBottom);
            }
        });
    }

    test("cloud fills the body: union bbox is at least 50% of body width", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        const dialog = await openCloud(page, "Frontend");
        const list = getList(dialog, "Frontend");

        await expect(list).toHaveAttribute("data-cloud-state", "measured");

        const bodyEl = list.locator("xpath=..");
        const bodyBox = await bodyEl.boundingBox();
        expect(bodyBox).not.toBeNull();

        const itemBoxes = await getItemBoxes(list);

        let minX = Infinity;
        let maxX = -Infinity;
        for (const box of itemBoxes) {
            if (box.x < minX) minX = box.x;
            if (box.x + box.width > maxX) maxX = box.x + box.width;
        }
        const unionWidth = maxX - minX;
        const ratio = unionWidth / (bodyBox as Box).width;

        console.log(
            `Cloud fills ${(ratio * 100).toFixed(1)}% of body width (body: ${(bodyBox as Box).width.toFixed(0)}px, union: ${unionWidth.toFixed(0)}px)`,
        );
        expect(ratio).toBeGreaterThanOrEqual(0.5);
    });

    test("Escape closes the dialog and focus returns to the tile button", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        const dialog = await openCloud(page, "Frontend");
        const list = getList(dialog, "Frontend");

        await expect(list).toHaveAttribute("data-cloud-state", "measured");

        const triggerBtn = page.getByRole("button", {
            name: "Show all Frontend technologies",
        });

        await page.keyboard.press("Escape");
        await expect(dialog).not.toBeVisible();
        await expect(triggerBtn).toBeFocused();
    });

    // ── Mobile layout (375×800) ───────────────────────────────────────────────

    test("at 375×800: list has data-cloud-state=mobile and items are not absolutely positioned", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 375, height: 800 });
        await page.goto("/en");
        await page
            .getByRole("button", { name: "Show all Frontend technologies" })
            .click();
        const dialog = page.getByRole("dialog");
        const list = getList(dialog, "Frontend");

        await expect(list).toHaveAttribute("data-cloud-state", "mobile");

        const items = list.locator("li");
        const count = await items.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const position = await items
                .nth(i)
                .evaluate((el) => window.getComputedStyle(el).position);
            expect(position).toBe("static");
        }
    });

    // ── Resize behaviour ──────────────────────────────────────────────────────

    test("resize 1280→700: state becomes mobile; back to 1280: becomes measured", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        const dialog = await openCloud(page, "Frontend");
        const list = getList(dialog, "Frontend");

        await expect(list).toHaveAttribute("data-cloud-state", "measured");

        // Resize below the 900 px tablet breakpoint — cloud switches to mobile layout.
        await page.setViewportSize({ width: 700, height: 900 });
        await expect(list).toHaveAttribute("data-cloud-state", "mobile");

        // Resize back to desktop — cloud re-measures and switches back.
        await page.setViewportSize({ width: 1280, height: 900 });
        await expect(list).toHaveAttribute("data-cloud-state", "measured");
    });
});
