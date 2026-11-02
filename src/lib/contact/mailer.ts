// outsource dependencies
import "server-only";
import { Resend } from "resend";

export interface MailOptions {
    apiKey: string;
    to: string;
    replyTo: string;
    subject: string;
    body: string;
}

export interface MailResult {
    error: { name: string; message: string } | null;
}

export async function sendEmail(opts: MailOptions): Promise<MailResult> {
    const resend = new Resend(opts.apiKey);
    const { error } = await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: opts.to,
        replyTo: opts.replyTo,
        subject: opts.subject,
        text: opts.body,
    });
    return { error };
}
