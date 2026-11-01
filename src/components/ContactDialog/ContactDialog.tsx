"use client";

// outsource dependencies
import { Dialog } from "radix-ui";
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./ContactDialog.module.scss";
import ContactForm from "@/components/ContactForm/ContactForm";

export default function ContactDialog() {
    const t = useTranslations("ContactForm");

    return (
        <>
            <Dialog.Overlay className={styles.veil} />
            <Dialog.Content className={styles.panel}>
                <div className={styles.header}>
                    <div className={styles.headerText}>
                        <Dialog.Title className={styles.title}>
                            {t("title")}
                        </Dialog.Title>
                        <Dialog.Description className={styles.description}>
                            {t("description")}
                        </Dialog.Description>
                    </div>
                    <Dialog.Close
                        className={styles.closeBtn}
                        aria-label={t("close")}
                    >
                        <svg
                            aria-hidden
                            width={18}
                            height={18}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </Dialog.Close>
                </div>
                <ContactForm />
            </Dialog.Content>
        </>
    );
}
