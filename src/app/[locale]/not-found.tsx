"use client";

// outsource dependencies
import { useTranslations } from "next-intl";

// local dependencies
import { Link } from "@/i18n/navigation";
import styles from "./not-found.module.scss";

export default function NotFound() {
    const t = useTranslations("NotFound");

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.description}>{t("description")}</p>
            <Link href="/" className={styles.link}>
                {t("home")}
            </Link>
        </div>
    );
}
