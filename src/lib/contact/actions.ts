"use server";

// outsource dependencies
import { z } from "zod";

// local dependencies
import { siteUrl } from "@/lib/site";
import { sendEmail } from "./mailer";
import { routing } from "@/i18n/routing";
import { buildContactEmail } from "./email";
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

    const rawLocale =
        z.object({ locale: z.string().optional() }).safeParse(input).data
            ?.locale ?? "";
    const locale = (routing.locales as readonly string[]).includes(rawLocale)
        ? rawLocale
        : "unknown";

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

    const { subject, text } = buildContactEmail({
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        locale,
        siteUrl,
    });

    try {
        const { error } = await sendEmail({
            apiKey,
            to: toEmail,
            replyTo: parsed.data.email,
            subject,
            body: text,
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
