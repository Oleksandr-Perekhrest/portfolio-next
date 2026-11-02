// outsource dependencies
import { test, expect, type Page } from "@playwright/test";

// Server requires 3 s of real elapsed time before accepting a submission.
const ANTI_SPAM_MS = 3000 + 500;

async function openAndFill(
    page: Page,
    opts: { name: string; email: string; message: string },
): Promise<number> {
    await page.goto("/en");
    const emailMeBtn = page.getByRole("button", { name: "Email me" });
    await emailMeBtn.scrollIntoViewIfNeeded();
    await emailMeBtn.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const formAppearedAt = Date.now();
    await page.getByLabel("Name", { exact: true }).fill(opts.name);
    await page.getByLabel("Email", { exact: true }).fill(opts.email);
    await page.getByLabel("Message", { exact: true }).fill(opts.message);
    return formAppearedAt;
}

test.describe("contact form", () => {
    test("happy path: sends email and shows success message", async ({
        page,
        request,
    }, testInfo) => {
        const id = Math.random().toString(36).slice(2, 8);
        const uniqueName = `E2E ${testInfo.project.name} ${id}`;
        const visitorEmail = "visitor@example.test";
        const message = "Hello, I am testing the contact form end-to-end.";

        const formAppearedAt = await openAndFill(page, {
            name: uniqueName,
            email: visitorEmail,
            message,
        });

        // Server requires real elapsed time; this is the only allowed waitForTimeout.
        const elapsed = Date.now() - formAppearedAt;
        if (elapsed < ANTI_SPAM_MS) {
            await page.waitForTimeout(ANTI_SPAM_MS - elapsed);
        }

        await page.getByRole("button", { name: "Send message" }).click();

        await expect(page.getByText("Message sent")).toBeVisible();
        await expect(page.locator(":focus")).toContainText("Message sent");

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
        expect(email!.text).toContain("Page language: EN");
    });

    test("too fast submit is silently dropped", async ({
        page,
        request,
    }, testInfo) => {
        const id = Math.random().toString(36).slice(2, 8);
        const uniqueName = `E2E fast ${testInfo.project.name} ${id}`;

        await openAndFill(page, {
            name: uniqueName,
            email: "fast@example.test",
            message: "This is a bot submission to test anti-spam filtering.",
        });

        // No anti-spam wait — submit immediately to trigger the silent drop.
        await page.getByRole("button", { name: "Send message" }).click();

        // Bot must not learn it was blocked — success message is shown.
        await expect(page.getByText("Message sent")).toBeVisible();

        // But no email was sent.
        const resp = await request.get("http://localhost:3101/__emails");
        const allEmails = (await resp.json()) as Record<string, unknown>[];
        const email = allEmails.find(
            (e) =>
                typeof e.subject === "string" && e.subject.includes(uniqueName),
        );
        expect(email).toBeUndefined();
    });

    test("send failure shows the Telegram fallback", async ({
        page,
        request,
    }, testInfo) => {
        const id = Math.random().toString(36).slice(2, 8);
        // Subject will be "Portfolio: MockFail …" → mock responds 429.
        const uniqueName = `MockFail ${testInfo.project.name} ${id}`;
        const visitorEmail = "failtest@example.test";
        const message = "Testing the send-failure path of the contact form.";

        const formAppearedAt = await openAndFill(page, {
            name: uniqueName,
            email: visitorEmail,
            message,
        });

        // Server requires real elapsed time; this is the only allowed waitForTimeout.
        const elapsed = Date.now() - formAppearedAt;
        if (elapsed < ANTI_SPAM_MS) {
            await page.waitForTimeout(ANTI_SPAM_MS - elapsed);
        }

        await page.getByRole("button", { name: "Send message" }).click();

        // Telegram fallback alert is shown.
        const alert = page.getByRole("alert");
        await expect(alert).toBeVisible();
        await expect(
            alert.getByRole("link", { name: /Telegram/ }),
        ).toBeVisible();

        // Submit button is disabled.
        await expect(
            page.getByRole("button", { name: "Send message" }),
        ).toBeDisabled();

        // Fields still hold the typed values.
        await expect(page.getByLabel("Name", { exact: true })).toHaveValue(
            uniqueName,
        );
        await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
            visitorEmail,
        );
        await expect(page.getByLabel("Message", { exact: true })).toHaveValue(
            message,
        );

        // Control: the mock received the request — failure was API-side, not validation.
        const resp = await request.get("http://localhost:3101/__emails");
        const allEmails = (await resp.json()) as Record<string, unknown>[];
        const received = allEmails.find(
            (e) =>
                typeof e.subject === "string" && e.subject.includes(uniqueName),
        );
        expect(received).toBeDefined();
    });
});
