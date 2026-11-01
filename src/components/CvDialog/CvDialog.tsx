"use client";

// outsource dependencies
import { Dialog } from "radix-ui";
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./CvDialog.module.scss";

type CvDialogProps = {
    pdfPath: string;
};

export default function CvDialog({ pdfPath }: CvDialogProps) {
    const t = useTranslations("Hero");
    const tExp = useTranslations("Experience");

    return (
        <>
            <Dialog.Overlay className={styles.veil} />
            <Dialog.Content
                className={styles.panel}
                aria-describedby={undefined}
            >
                <div className={styles.header}>
                    <Dialog.Title className={styles.title}>
                        {t("cv.dialogTitle")}
                    </Dialog.Title>
                    <Dialog.Close
                        className={styles.closeBtn}
                        aria-label={tExp("cloud.close")}
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
                <iframe
                    src={pdfPath}
                    className={styles.iframe}
                    title={t("cv.dialogTitle")}
                />
            </Dialog.Content>
        </>
    );
}
