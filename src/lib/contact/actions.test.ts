/**
 * @jest-environment node
 */

// outsource dependencies
import {
    it,
    jest,
    expect,
    describe,
    afterEach,
    beforeEach,
} from "@jest/globals";

// local dependencies
import { siteUrl } from "@/lib/site";
import { buildContactEmail } from "./email";
import type { MailResult, MailOptions } from "./mailer";

const NOW = 1_000_000;
const API_KEY = "re_test_key";
const TO_EMAIL = "owner@example.com";

const validPayload = {
    name: "Alice",
    email: "alice@example.com",
    message: "Hello from the contact form.",
    website: "",
    startedAt: NOW - 3000,
    locale: "en",
};

describe("sendContactMessage", () => {
    let savedApiKey: string | undefined;
    let savedToEmail: string | undefined;
    let sendEmailMock: jest.Mock<(opts: MailOptions) => Promise<MailResult>>;
    let sendContactMessage: typeof import("./actions").sendContactMessage;

    beforeEach(() => {
        savedApiKey = process.env.RESEND_API_KEY;
        savedToEmail = process.env.CONTACT_TO_EMAIL;
        process.env.RESEND_API_KEY = API_KEY;
        process.env.CONTACT_TO_EMAIL = TO_EMAIL;
        jest.spyOn(Date, "now").mockReturnValue(NOW);
        jest.spyOn(console, "error").mockImplementation(() => {});

        sendEmailMock = jest
            .fn<(opts: MailOptions) => Promise<MailResult>>()
            .mockResolvedValue({ error: null });
        jest.isolateModules(() => {
            jest.doMock("./mailer", () => ({ sendEmail: sendEmailMock }));
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const mod = require("./actions") as typeof import("./actions");
            sendContactMessage = mod.sendContactMessage;
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetModules();
        if (savedApiKey === undefined) {
            delete process.env.RESEND_API_KEY;
        } else {
            process.env.RESEND_API_KEY = savedApiKey;
        }
        if (savedToEmail === undefined) {
            delete process.env.CONTACT_TO_EMAIL;
        } else {
            process.env.CONTACT_TO_EMAIL = savedToEmail;
        }
    });

    // Case 1: anti-spam schema rejects non-object input silently
    it("returns success without sending for null input", async () => {
        const result = await sendContactMessage(null);
        expect(result).toEqual({ status: "success" });
        expect(sendEmailMock).not.toHaveBeenCalled();
    });

    it("returns success without sending for a string input", async () => {
        const result = await sendContactMessage("a string");
        expect(result).toEqual({ status: "success" });
        expect(sendEmailMock).not.toHaveBeenCalled();
    });

    it("returns success without sending for an array input", async () => {
        const result = await sendContactMessage([]);
        expect(result).toEqual({ status: "success" });
        expect(sendEmailMock).not.toHaveBeenCalled();
    });

    // Case 2: honeypot
    it("returns success without sending when honeypot field is filled", async () => {
        const result = await sendContactMessage({
            ...validPayload,
            website: "http://bot.example.com",
        });
        expect(result).toEqual({ status: "success" });
        expect(sendEmailMock).not.toHaveBeenCalled();
    });

    // Case 3: submission time guard
    it("returns success without sending when submitted 2999 ms after startedAt", async () => {
        const result = await sendContactMessage({
            ...validPayload,
            startedAt: NOW - 2999,
        });
        expect(result).toEqual({ status: "success" });
        expect(sendEmailMock).not.toHaveBeenCalled();
    });

    it("sends when submitted exactly 3000 ms after startedAt", async () => {
        const result = await sendContactMessage({
            ...validPayload,
            startedAt: NOW - 3000,
        });
        expect(result).toEqual({ status: "success" });
        expect(sendEmailMock).toHaveBeenCalledTimes(1);
    });

    // Case 4: field validation
    it("returns invalid with our error codes for bad field values", async () => {
        const result = await sendContactMessage({
            ...validPayload,
            name: "",
            email: "not-an-email",
            message: "short",
        });
        expect(result).toEqual({
            status: "invalid",
            fieldErrors: {
                name: ["nameInvalid"],
                email: ["emailInvalid"],
                message: ["messageLength"],
            },
        });
        expect(sendEmailMock).not.toHaveBeenCalled();
    });

    // Case 5: missing env vars
    it("returns unavailable and logs when RESEND_API_KEY is missing", async () => {
        delete process.env.RESEND_API_KEY;
        const result = await sendContactMessage(validPayload);
        expect(result).toEqual({ status: "unavailable" });
        expect(sendEmailMock).not.toHaveBeenCalled();
        expect(jest.mocked(console.error)).toHaveBeenCalledWith(
            "sendContactMessage: RESEND_API_KEY or CONTACT_TO_EMAIL is not configured",
        );
    });

    it("returns unavailable and logs when CONTACT_TO_EMAIL is missing", async () => {
        delete process.env.CONTACT_TO_EMAIL;
        const result = await sendContactMessage(validPayload);
        expect(result).toEqual({ status: "unavailable" });
        expect(sendEmailMock).not.toHaveBeenCalled();
        expect(jest.mocked(console.error)).toHaveBeenCalledWith(
            "sendContactMessage: RESEND_API_KEY or CONTACT_TO_EMAIL is not configured",
        );
    });

    // Case 6: sendEmail resolves with an API-level error
    it("returns unavailable and logs when sendEmail resolves with an error object", async () => {
        sendEmailMock.mockResolvedValue({
            error: { name: "daily_quota_exceeded", message: "Limit reached" },
        });
        const result = await sendContactMessage(validPayload);
        expect(result).toEqual({ status: "unavailable" });
        expect(jest.mocked(console.error)).toHaveBeenCalledWith(
            "sendContactMessage: Resend error:",
            "daily_quota_exceeded",
        );
    });

    // Case 7: sendEmail throws
    it("returns unavailable and logs when sendEmail rejects", async () => {
        sendEmailMock.mockRejectedValue(new Error("network failure"));
        const result = await sendContactMessage(validPayload);
        expect(result).toEqual({ status: "unavailable" });
        expect(jest.mocked(console.error)).toHaveBeenCalledWith(
            "sendContactMessage: Resend threw:",
            "Error",
        );
    });

    // Case 8: full success — verify every argument passed to sendEmail
    it("returns success and calls sendEmail with the correct arguments", async () => {
        const result = await sendContactMessage(validPayload);
        expect(result).toEqual({ status: "success" });
        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        const { text } = buildContactEmail({
            name: validPayload.name,
            email: validPayload.email,
            message: validPayload.message,
            locale: "en",
            siteUrl,
        });
        expect(sendEmailMock).toHaveBeenCalledWith({
            apiKey: API_KEY,
            to: TO_EMAIL,
            replyTo: validPayload.email,
            subject: "Portfolio: Alice",
            body: text,
        });
    });

    // Case 9: unknown locale — "fr" and absent
    it("sends for locale 'fr' with body containing 'Page language: unknown'", async () => {
        const result = await sendContactMessage({
            ...validPayload,
            locale: "fr",
        });
        expect(result).toEqual({ status: "success" });
        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        const body = sendEmailMock.mock.calls[0]![0].body;
        expect(body).toContain("Page language: unknown");
    });

    it("sends when locale is absent with body containing 'Page language: unknown'", async () => {
        const result = await sendContactMessage({
            ...validPayload,
            locale: undefined,
        });
        expect(result).toEqual({ status: "success" });
        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        const body = sendEmailMock.mock.calls[0]![0].body;
        expect(body).toContain("Page language: unknown");
    });
});
