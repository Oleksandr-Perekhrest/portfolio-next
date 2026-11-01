type ContactEmailInput = {
    name: string;
    email: string;
    message: string;
    locale: string;
    siteUrl: string;
};

export function buildContactEmail(input: ContactEmailInput): {
    subject: string;
    text: string;
} {
    const host = new URL(input.siteUrl).host;
    const langLabel =
        input.locale === "uk" ? "UA" : input.locale === "en" ? "EN" : "unknown";

    const subject = `Portfolio: ${input.name}`;
    const text = [
        `New message from the contact form on ${host}`,
        "",
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Page language: ${langLabel}`,
        "",
        "Message:",
        input.message,
        "",
        "—",
        "Reply to this email to answer the sender directly.",
    ].join("\n");

    return { subject, text };
}
