// outsource dependencies
import { it, expect, describe } from "@jest/globals";

// local dependencies
import { contactSchema } from "./schema";

const valid = {
    name: "Alice",
    email: "alice@example.com",
    message: "Hello there!",
};

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
            const result = contactSchema.safeParse({ ...valid, name: "" });
            expect(result.success).toBe(false);
            if (!result.success) {
                const flat = result.error.flatten();
                expect(flat.fieldErrors.name).toContain("nameInvalid");
            }
        });

        it("rejects a name longer than 100 characters", () => {
            const result = contactSchema.safeParse({
                ...valid,
                name: "a".repeat(101),
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                const flat = result.error.flatten();
                expect(flat.fieldErrors.name).toContain("nameInvalid");
            }
        });

        it("accepts a name of exactly 100 characters", () => {
            const result = contactSchema.safeParse({
                ...valid,
                name: "a".repeat(100),
            });
            expect(result.success).toBe(true);
        });

        it("rejects a name containing a control character", () => {
            const result = contactSchema.safeParse({
                ...valid,
                name: "Alice\x01",
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                const flat = result.error.flatten();
                expect(flat.fieldErrors.name).toContain("nameInvalid");
            }
        });
    });

    describe("email", () => {
        it("rejects an empty email", () => {
            const result = contactSchema.safeParse({ ...valid, email: "" });
            expect(result.success).toBe(false);
            if (!result.success) {
                const flat = result.error.flatten();
                expect(flat.fieldErrors.email).toContain("emailInvalid");
            }
        });

        it("rejects a malformed email", () => {
            const result = contactSchema.safeParse({
                ...valid,
                email: "not-an-email",
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                const flat = result.error.flatten();
                expect(flat.fieldErrors.email).toContain("emailInvalid");
            }
        });

        it("rejects an email longer than 254 characters", () => {
            const local = "a".repeat(243);
            const result = contactSchema.safeParse({
                ...valid,
                email: `${local}@example.com`,
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                const flat = result.error.flatten();
                expect(flat.fieldErrors.email).toContain("emailInvalid");
            }
        });

        it("accepts an email of exactly 254 characters", () => {
            const local = "a".repeat(242);
            const result = contactSchema.safeParse({
                ...valid,
                email: `${local}@example.com`,
            });
            expect(result.success).toBe(true);
        });
    });

    describe("message", () => {
        it("rejects a message shorter than 10 characters", () => {
            const result = contactSchema.safeParse({
                ...valid,
                message: "Hi!",
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                const flat = result.error.flatten();
                expect(flat.fieldErrors.message).toContain("messageLength");
            }
        });

        it("accepts a message of exactly 10 characters", () => {
            const result = contactSchema.safeParse({
                ...valid,
                message: "a".repeat(10),
            });
            expect(result.success).toBe(true);
        });

        it("rejects a message longer than 2000 characters", () => {
            const result = contactSchema.safeParse({
                ...valid,
                message: "a".repeat(2001),
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                const flat = result.error.flatten();
                expect(flat.fieldErrors.message).toContain("messageLength");
            }
        });

        it("accepts a message of exactly 2000 characters", () => {
            const result = contactSchema.safeParse({
                ...valid,
                message: "a".repeat(2000),
            });
            expect(result.success).toBe(true);
        });
    });
});
