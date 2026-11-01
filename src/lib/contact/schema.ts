// outsource dependencies
import { z } from "zod";

export type ContactErrorCode = "emailInvalid" | "messageLength" | "nameInvalid";

const nameSchema = z
    .string()
    .trim()
    .min(1, "nameInvalid")
    .max(100, "nameInvalid")
    .refine((v) => !/[\x00-\x1f\x7f]/.test(v), "nameInvalid");

const emailSchema = z
    .string()
    .trim()
    .max(254, "emailInvalid")
    .email("emailInvalid");

const messageSchema = z
    .string()
    .trim()
    .min(10, "messageLength")
    .max(2000, "messageLength");

export const contactSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    message: messageSchema,
});

export type ContactFormValues = z.infer<typeof contactSchema>;
