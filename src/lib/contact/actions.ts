"use server";

// local dependencies
import { sendEmail } from "./mailer";
import { contactSchema } from "./schema";
import type { ContactFormValues } from "./schema";

export type ContactResult =
    | { status: "success" }
    | { status: "unavailable" }
    | {
          status: "invalid";
          fieldErrors: Partial<Record<keyof ContactFormValues, string[]>>;
      };

interface ContactInput extends ContactFormValues {
    website: string;
    startedAt: number | null | undefined;
}

export async function sendContactMessage(
    input: ContactInput,
): Promise<ContactResult> {
    const elapsed =
        typeof input.startedAt === "number" && !Number.isNaN(input.startedAt)
            ? Date.now() - input.startedAt
            : -1;

    if (input.website !== "" || elapsed < 3000) {
        return { status: "success" };
    }

    const parsed = contactSchema.safeParse({
        name: input.name,
        email: input.email,
        message: input.message,
    });

    if (!parsed.success) {
        const fieldErrors: Partial<Record<keyof ContactFormValues, string[]>> =
            {};
        for (const issue of parsed.error.issues) {
            const key = issue.path[0] as keyof ContactFormValues;
            (fieldErrors[key] ??= []).push(issue.message);
        }
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
