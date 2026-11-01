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

    it("includes name, email, and message in the text body", () => {
        const { text } = buildContactEmail(base);
        expect(text).toContain("Name: Alice");
        expect(text).toContain("Email: alice@example.com");
        expect(text).toContain("Hello from the contact form.");
    });

    it("extracts the host from siteUrl", () => {
        const { text } = buildContactEmail({
            ...base,
            siteUrl: "https://myportfolio.dev/contact",
        });
        expect(text).toContain("myportfolio.dev");
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

    it("includes the reply instruction line", () => {
        const { text } = buildContactEmail(base);
        expect(text).toContain(
            "Reply to this email to answer the sender directly.",
        );
    });
});
