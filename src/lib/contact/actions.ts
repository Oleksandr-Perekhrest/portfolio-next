"use server";

// outsource dependencies
import { z } from "zod";

// local dependencies
import { sendEmail } from "./mailer";
import {
    contactSchema,
    type ContactErrorCode,
    type ContactFormValues,
} from "./schema";

const antiSpamSchema = z.object({
    website: z.string(),
    startedAt: z.number(),
});

export type ContactResult =
    | { status: "success" }
    | { status: "unavailable" }
    | {
          status: "invalid";
          fieldErrors: Partial<
              Record<keyof ContactFormValues, ContactErrorCode[]>
          >;
      };

export async function sendContactMessage(
    input: unknown,
): Promise<ContactResult> {
    const antiSpam = antiSpamSchema.safeParse(input);
    if (!antiSpam.success) return { status: "success" };

    if (
        antiSpam.data.website !== "" ||
        Date.now() - antiSpam.data.startedAt < 3000
    ) {
        return { status: "success" };
    }

    const parsed = contactSchema.safeParse(input);
    if (!parsed.success) {
        const { fieldErrors } = z.flattenError(
            parsed.error,
            (issue) => issue.message as ContactErrorCode,
        );
        return { status: "invalid", fieldErrors };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;

    if (!apiKey || !toEmail) {
        console.error(
            "sendContactMessage: RESEND_API_KEY or CONTACT_TO_EMAIL is not configured",
        );
        return { status: "unavailable" };
    }

    try {
        const { error } = await sendEmail({
            apiKey,
            to: toEmail,
            replyTo: parsed.data.email,
            subject: `Portfolio: ${parsed.data.name}`,
            body: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`,
        });

        if (error) {
            console.error("sendContactMessage: Resend error:", error.name);
            return { status: "unavailable" };
        }

        return { status: "success" };
    } catch (err) {
        const name = err instanceof Error ? err.name : "UnknownError";
        console.error("sendContactMessage: Resend threw:", name);
        return { status: "unavailable" };
    }
}
