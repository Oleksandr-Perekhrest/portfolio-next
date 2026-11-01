"use client";

// outsource dependencies
import { useState } from "react";
import { Dialog } from "radix-ui";
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./Contact.module.scss";
import { contacts } from "@/content/contacts";
import TelegramIcon from "@/components/icons/TelegramIcon";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import ContactDialog from "@/components/ContactDialog/ContactDialog";

export default function Contact() {
    const t = useTranslations("Contact");
    const tBtn = useTranslations("ButtonLink");
    const [emailOpen, setEmailOpen] = useState(false);

    return (
        <section id="contact" className={styles.section}>
            <SectionTitle>{t("label")}</SectionTitle>
            <div className={styles.card}>
                <div className={styles.textCol}>
                    <h3 className={styles.title}>{t("title")}</h3>
                    <p className={styles.lead}>
                        {t("lead")}
                        <br />
                        {t("reachOut")}
                    </p>
                </div>
                <div className={styles.links}>
                    <button
                        type="button"
                        className={styles.emailMeBtn}
                        onClick={() => setEmailOpen(true)}
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
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <path d="M3 7l9 6 9-6" />
                        </svg>
                        {t("emailMe")}
                    </button>
                    <a
                        href={contacts.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.iconLink}
                    >
                        <TelegramIcon />
                        <span className={styles.srOnly}>
                            {t("telegram")} {tBtn("newTab")}
                        </span>
                    </a>
                    <a
                        href={contacts.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.iconLink}
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
                            <rect x="3" y="3" width="18" height="18" rx="3" />
                            <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
                        </svg>
                        <span className={styles.srOnly}>
                            {t("linkedin")} {tBtn("newTab")}
                        </span>
                    </a>
                    <a
                        href={contacts.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.iconLink}
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
                            <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
                        </svg>
                        <span className={styles.srOnly}>
                            {t("github")} {tBtn("newTab")}
                        </span>
                    </a>
                </div>
            </div>
            <Dialog.Root open={emailOpen} onOpenChange={setEmailOpen}>
                <Dialog.Portal>
                    <ContactDialog />
                </Dialog.Portal>
            </Dialog.Root>
        </section>
    );
}
