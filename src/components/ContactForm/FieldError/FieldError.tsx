"use client";

// outsource dependencies
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./FieldError.module.scss";
import type { ContactErrorCode } from "@/lib/contact/schema";

type FieldErrorProps = {
    id: string;
    code: string;
};

export default function FieldError({ id, code }: FieldErrorProps) {
    const t = useTranslations("ContactForm");

    return (
        <p id={id} className={styles.errorMsg}>
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
            {t(`errors.${code as ContactErrorCode}`)}
        </p>
    );
}
