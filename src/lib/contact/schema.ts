// outsource dependencies
import { z } from "zod";

export type ContactErrorCode = "emailInvalid" | "messageLength" | "nameInvalid";

// Bindings below keep schema messages in sync with ContactErrorCode at compile time.
const NAME_ERR = "nameInvalid" satisfies ContactErrorCode;
const EMAIL_ERR = "emailInvalid" satisfies ContactErrorCode;
const MSG_ERR = "messageLength" satisfies ContactErrorCode;

const nameSchema = z
    .string({ error: NAME_ERR })
    .trim()
    .min(1, NAME_ERR)
    .max(100, NAME_ERR)
    .refine((v) => !/[\x00-\x1f\x7f]/.test(v), NAME_ERR);

// trim → max → z.email() (v4 standalone) via pipe to ensure trim runs before format check.
const emailSchema = z
    .string({ error: EMAIL_ERR })
    .trim()
    .max(254, EMAIL_ERR)
    .pipe(z.email(EMAIL_ERR));

const messageSchema = z
    .string({ error: MSG_ERR })
    .trim()
    .min(10, MSG_ERR)
    .max(2000, MSG_ERR);

export const contactSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    message: messageSchema,
});

export type ContactFormValues = z.infer<typeof contactSchema>;
