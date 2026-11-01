"use client";

// outsource dependencies
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// local dependencies
import { contacts } from "@/content/contacts";
import styles from "./ContactForm.module.scss";
import FieldError from "./FieldError/FieldError";
import TelegramIcon from "@/components/icons/TelegramIcon";
import { contactSchema, type ContactFormValues } from "@/lib/contact/schema";

export default function ContactForm() {
    const t = useTranslations("ContactForm");
    const tBtn = useTranslations("ButtonLink");
    const formId = useId();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit: SubmitHandler<ContactFormValues> = () => {};

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
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
                <label htmlFor={`${formId}-message`} className={styles.label}>
                    {t("message")}
                </label>
                <textarea
                    id={`${formId}-message`}
                    rows={5}
                    className={`${styles.input} ${styles.textarea}${errors.message ? ` ${styles.inputError}` : ""}`}
                    placeholder={t("messagePlaceholder")}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={
                        errors.message ? `${formId}-message-error` : undefined
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

            <button type="submit" className={styles.submitBtn}>
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
                {t("submit")}
            </button>

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
