"use client";

// outsource dependencies
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useRef, useState, useEffect } from "react";

// local dependencies
import { contacts } from "@/content/contacts";
import styles from "./ContactForm.module.scss";
import FieldError from "./FieldError/FieldError";
import TelegramIcon from "@/components/icons/TelegramIcon";
import { contactSchema, type ContactFormValues } from "@/lib/contact/schema";
import { sendContactMessage, type ContactResult } from "@/lib/contact/actions";

const HONEYPOT_LABEL = "Website";

type Props = {
    isUnavailable: boolean;
    onUnavailable: () => void;
};

export default function ContactForm({ isUnavailable, onUnavailable }: Props) {
    const t = useTranslations("ContactForm");
    const tBtn = useTranslations("ButtonLink");
    const formId = useId();

    const [websiteValue, setWebsiteValue] = useState("");
    const [startedAt] = useState(() => Date.now());
    const [succeeded, setSucceeded] = useState(false);
    const closeRef = useRef<HTMLButtonElement>(null);

    const {
        register,
        handleSubmit,
        setError,
        setFocus,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    useEffect(() => {
        if (succeeded) {
            closeRef.current?.focus();
        }
    }, [succeeded]);

    const onSubmit: SubmitHandler<ContactFormValues> = async (values) => {
        let result: ContactResult;
        try {
            result = await sendContactMessage({
                ...values,
                website: websiteValue,
                startedAt,
            });
        } catch {
            result = { status: "unavailable" };
        }

        if (result.status === "success") {
            setSucceeded(true);
        } else if (result.status === "invalid") {
            const fields = ["name", "email", "message"] as const;
            let firstField: (typeof fields)[number] | null = null;
            for (const field of fields) {
                const codes = result.fieldErrors[field];
                if (codes && codes.length > 0) {
                    setError(field, { message: codes[0] });
                    if (!firstField) firstField = field;
                }
            }
            if (firstField) setFocus(firstField);
        } else {
            onUnavailable();
        }
    };

    if (succeeded) {
        return (
            <div className={styles.success} role="status">
                <div className={styles.successCircle}>
                    <svg
                        aria-hidden
                        width={28}
                        height={28}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 12l5 5L20 7" />
                    </svg>
                </div>
                <p className={styles.successTitle}>{t("successTitle")}</p>
                <p className={styles.successText}>{t("successText")}</p>
                <Dialog.Close ref={closeRef} className={styles.close}>
                    {t("close")}
                </Dialog.Close>
            </div>
        );
    }

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <div aria-hidden="true" className={styles.honeypot}>
                <label htmlFor={`${formId}-website`}>{HONEYPOT_LABEL}</label>
                <input
                    id={`${formId}-website`}
                    type="text"
                    name="website"
                    value={websiteValue}
                    tabIndex={-1}
                    autoComplete="off"
                    onChange={(e) => setWebsiteValue(e.target.value)}
                />
            </div>

            <fieldset disabled={isSubmitting} className={styles.fieldset}>
                <div className={styles.field}>
                    <label htmlFor={`${formId}-name`} className={styles.label}>
                        {t("name")}
                    </label>
                    <input
                        id={`${formId}-name`}
                        type="text"
                        className={`${styles.input}${errors.name ? ` ${styles.inputError}` : ""}`}
                        placeholder={t("namePlaceholder")}
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={
                            errors.name ? `${formId}-name-error` : undefined
                        }
                        {...register("name")}
                    />
                    {errors.name?.message && (
                        <FieldError
                            id={`${formId}-name-error`}
                            code={errors.name.message}
                        />
                    )}
                </div>

                <div className={styles.field}>
                    <label htmlFor={`${formId}-email`} className={styles.label}>
                        {t("email")}
                    </label>
                    <input
                        id={`${formId}-email`}
                        type="email"
                        className={`${styles.input}${errors.email ? ` ${styles.inputError}` : ""}`}
                        placeholder={t("emailPlaceholder")}
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={
                            errors.email ? `${formId}-email-error` : undefined
                        }
                        {...register("email")}
                    />
                    {errors.email?.message && (
                        <FieldError
                            id={`${formId}-email-error`}
                            code={errors.email.message}
                        />
                    )}
                </div>

                <div className={styles.field}>
                    <label
                        htmlFor={`${formId}-message`}
                        className={styles.label}
                    >
                        {t("message")}
                    </label>
                    <textarea
                        id={`${formId}-message`}
                        rows={5}
                        className={`${styles.input} ${styles.textarea}${errors.message ? ` ${styles.inputError}` : ""}`}
                        placeholder={t("messagePlaceholder")}
                        aria-invalid={errors.message ? true : undefined}
                        aria-describedby={
                            errors.message
                                ? `${formId}-message-error`
                                : undefined
                        }
                        {...register("message")}
                    />
                    {errors.message?.message && (
                        <FieldError
                            id={`${formId}-message-error`}
                            code={errors.message.message}
                        />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isUnavailable}
                    className={styles.submitBtn}
                >
                    <svg
                        aria-hidden
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    {isSubmitting ? t("sending") : t("submit")}
                </button>
            </fieldset>

            {isUnavailable && (
                <p role="alert" className={styles.unavailable}>
                    <svg
                        aria-hidden
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v5M12 16v.01" />
                    </svg>
                    {t.rich("unavailable", {
                        link: (children) => (
                            <a
                                href={contacts.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.unavailableLink}
                            >
                                {children}
                                <span className={styles.srOnly}>
                                    {tBtn("newTab")}
                                </span>
                            </a>
                        ),
                    })}
                </p>
            )}

            <p className={styles.hint}>
                {t.rich("hint", {
                    link: (children) => (
                        <a
                            href={contacts.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.hintLink}
                        >
                            <TelegramIcon size={16} />
                            {children}
                            <span className={styles.srOnly}>
                                {tBtn("newTab")}
                            </span>
                        </a>
                    ),
                })}
            </p>
        </form>
    );
}
