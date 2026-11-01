// outsource dependencies
import { z } from "zod";
import { it, expect, describe } from "@jest/globals";

// local dependencies
import { contactSchema } from "./schema";

const valid = {
    name: "Alice",
    email: "alice@example.com",
    message: "Hello there!",
};

function fieldErrors(input: unknown) {
    const result = contactSchema.safeParse(input);
    if (result.success) return null;
    return z.flattenError(result.error).fieldErrors;
}

describe("contactSchema", () => {
    describe("valid input", () => {
        it("accepts a well-formed submission", () => {
            const result = contactSchema.safeParse(valid);
            expect(result.success).toBe(true);
        });

        it("trims whitespace from name, email, and message", () => {
            const result = contactSchema.safeParse({
                name: "  Alice  ",
                email: "  alice@example.com  ",
                message: "  Hello there!  ",
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.name).toBe("Alice");
                expect(result.data.email).toBe("alice@example.com");
                expect(result.data.message).toBe("Hello there!");
            }
        });
    });

    describe("name", () => {
        it("rejects an empty name", () => {
            expect(fieldErrors({ ...valid, name: "" })?.name).toContain(
                "nameInvalid",
            );
        });

        it("rejects a name that is only whitespace", () => {
            expect(fieldErrors({ ...valid, name: "   " })?.name).toContain(
                "nameInvalid",
            );
        });

        it("rejects a name longer than 100 characters", () => {
            expect(
                fieldErrors({ ...valid, name: "a".repeat(101) })?.name,
            ).toContain("nameInvalid");
        });

        it("accepts a name of exactly 100 characters", () => {
            const result = contactSchema.safeParse({
                ...valid,
                name: "a".repeat(100),
            });
            expect(result.success).toBe(true);
        });

        it("rejects a name containing a control character (\\x01)", () => {
            expect(
                fieldErrors({ ...valid, name: "Alice\x01" })?.name,
            ).toContain("nameInvalid");
        });

        it("rejects a name containing a line break (\\n)", () => {
            expect(
                fieldErrors({ ...valid, name: "Alice\nBob" })?.name,
            ).toContain("nameInvalid");
        });

        it("rejects a non-string name and returns only our error code", () => {
            expect(fieldErrors({ ...valid, name: 123 })?.name).toEqual([
                "nameInvalid",
            ]);
        });
    });

    describe("email", () => {
        it("rejects an empty email", () => {
            expect(fieldErrors({ ...valid, email: "" })?.email).toContain(
                "emailInvalid",
            );
        });

        it("rejects a malformed email", () => {
            expect(
                fieldErrors({ ...valid, email: "not-an-email" })?.email,
            ).toContain("emailInvalid");
        });

        it("rejects an email longer than 254 characters", () => {
            const local = "a".repeat(243);
            expect(
                fieldErrors({ ...valid, email: `${local}@example.com` })?.email,
            ).toContain("emailInvalid");
        });

        it("accepts an email of exactly 254 characters", () => {
            const local = "a".repeat(242);
            const result = contactSchema.safeParse({
                ...valid,
                email: `${local}@example.com`,
            });
            expect(result.success).toBe(true);
        });

        it("rejects an undefined email and returns only our error code", () => {
            expect(fieldErrors({ ...valid, email: undefined })?.email).toEqual([
                "emailInvalid",
            ]);
        });
    });

    describe("message", () => {
        it("rejects a message shorter than 10 characters", () => {
            expect(
                fieldErrors({ ...valid, message: "Hi!" })?.message,
            ).toContain("messageLength");
        });

        it("accepts a message of exactly 10 characters", () => {
            const result = contactSchema.safeParse({
                ...valid,
                message: "a".repeat(10),
            });
            expect(result.success).toBe(true);
        });

        it("rejects a message longer than 2000 characters", () => {
            expect(
                fieldErrors({ ...valid, message: "a".repeat(2001) })?.message,
            ).toContain("messageLength");
        });

        it("accepts a message of exactly 2000 characters", () => {
            const result = contactSchema.safeParse({
                ...valid,
                message: "a".repeat(2000),
            });
            expect(result.success).toBe(true);
        });

        it("rejects a null message and returns only our error code", () => {
            expect(fieldErrors({ ...valid, message: null })?.message).toEqual([
                "messageLength",
            ]);
        });
    });
});
