"use client";

// outsource dependencies
import { useState } from "react";
import { Dialog } from "radix-ui";
import { useLocale, useTranslations } from "next-intl";

// local dependencies
import styles from "./Hero.module.scss";
import { getCvPath } from "@/content/cv";
import CvDialog from "@/components/CvDialog/CvDialog";
import ButtonLink from "@/components/ButtonLink/ButtonLink";

export default function Hero() {
    const t = useTranslations("Hero");
    const locale = useLocale();
    const pdfPath = getCvPath(locale);
    const [cvOpen, setCvOpen] = useState(false);

    return (
        <>
            <section className={styles.hero}>
                <div className={styles.inner}>
                    <h1 className={styles.title}>{t("title")}</h1>
                    <p className={styles.keywords}>{t("keywords")}</p>
                    <p className={styles.lead}>{t("lead")}</p>
                    <div className={styles.actions}>
                        <ButtonLink href="#experience" variant="primary">
                            {t("projects")}
                            <svg
                                aria-hidden
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path d="M12 5v14M5 12l7 7 7-7" />
                            </svg>
                        </ButtonLink>
                        <ButtonLink
                            href={pdfPath}
                            variant="secondary"
                            external
                            onClick={(e) => {
                                if (
                                    window.innerWidth >= 900 &&
                                    e.button === 0 &&
                                    !e.metaKey &&
                                    !e.ctrlKey &&
                                    !e.shiftKey &&
                                    !e.altKey
                                ) {
                                    e.preventDefault();
                                    setCvOpen(true);
                                }
                            }}
                        >
                            {t("cv.viewCv")}
                        </ButtonLink>
                        <ButtonLink href={pdfPath} variant="secondary" download>
                            {t("cv.downloadPdf")}
                        </ButtonLink>
                    </div>
                </div>
            </section>
            <Dialog.Root open={cvOpen} onOpenChange={setCvOpen}>
                <Dialog.Portal>
                    <CvDialog pdfPath={pdfPath} />
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}
