// outsource dependencies
import { it, expect, describe } from "@jest/globals";

// local dependencies
import { buildContactEmail } from "./email";

const base = {
    name: "Alice",
    email: "alice@example.com",
    message: "Hello from the contact form.",
    locale: "en",
    siteUrl: "https://example.com",
};

describe("buildContactEmail", () => {
    it("uses the sender name in the subject", () => {
        const { subject } = buildContactEmail(base);
        expect(subject).toBe("Portfolio: Alice");
    });

    it("builds the complete text body", () => {
        const { text } = buildContactEmail(base);
        expect(text).toBe(
            [
                "New message from the contact form on example.com",
                "",
                "Name: Alice",
                "Email: alice@example.com",
                "Page language: EN",
                "",
                "Message:",
                "Hello from the contact form.",
                "",
                "—",
                "Reply to this email to answer the sender directly.",
            ].join("\n"),
        );
    });

    it("uses only the host from siteUrl, not the full URL", () => {
        const { text } = buildContactEmail({
            ...base,
            siteUrl: "https://myportfolio.dev/contact",
        });
        const firstLine = text.split("\n")[0];
        expect(firstLine).toBe(
            "New message from the contact form on myportfolio.dev",
        );
    });

    describe("locale label", () => {
        it('maps locale "en" to "EN"', () => {
            const { text } = buildContactEmail({ ...base, locale: "en" });
            expect(text).toContain("Page language: EN");
        });

        it('maps locale "uk" to "UA"', () => {
            const { text } = buildContactEmail({ ...base, locale: "uk" });
            expect(text).toContain("Page language: UA");
        });

        it('maps an unknown locale to "unknown"', () => {
            const { text } = buildContactEmail({ ...base, locale: "fr" });
            expect(text).toContain("Page language: unknown");
        });
    });
});
