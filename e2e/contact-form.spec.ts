// outsource dependencies
import { test, expect } from "@playwright/test";

// Server requires 3 s of real elapsed time before accepting a submission.
const ANTI_SPAM_MS = 3000 + 500;

test.describe("contact form", () => {
    test("happy path: sends email and shows success message", async ({
        page,
        request,
    }, testInfo) => {
        const id = Math.random().toString(36).slice(2, 8);
        const uniqueName = `E2E ${testInfo.project.name} ${id}`;
        const visitorEmail = "visitor@example.test";
        const message = "Hello, I am testing the contact form end-to-end.";

        await page.goto("/en");
        const emailMeBtn = page.getByRole("button", { name: "Email me" });
        await emailMeBtn.scrollIntoViewIfNeeded();
        await emailMeBtn.click();
        await expect(page.getByRole("dialog")).toBeVisible();

        const formAppearedAt = Date.now();

        await page.getByLabel("Name", { exact: true }).fill(uniqueName);
        await page.getByLabel("Email", { exact: true }).fill(visitorEmail);
        await page.getByLabel("Message", { exact: true }).fill(message);

        // Server requires real elapsed time; this is the only allowed waitForTimeout.
        const elapsed = Date.now() - formAppearedAt;
        if (elapsed < ANTI_SPAM_MS) {
            await page.waitForTimeout(ANTI_SPAM_MS - elapsed);
        }

        await page.getByRole("button", { name: "Send message" }).click();

        // The success title appears in successMessage div (tabindex=-1, scoped
        // inside the dialog to avoid matching the dialog panel itself).
        const dialog = page.getByRole("dialog");
        const successDiv = dialog.locator('[tabindex="-1"]');
        await expect(successDiv).toBeVisible();
        await expect(successDiv).toBeFocused();

        const resp = await request.get("http://localhost:3101/__emails");
        const allEmails = (await resp.json()) as Record<string, unknown>[];
        const email = allEmails.find(
            (e) =>
                typeof e.subject === "string" && e.subject.includes(uniqueName),
        );
        expect(email).toBeDefined();
        expect(email!.to).toBe("owner@example.test");
        expect(email!.reply_to).toBe(visitorEmail);
        expect(email!.subject).toBe(`Portfolio: ${uniqueName}`);
        expect(email!.text).toContain(message);
    });
});
