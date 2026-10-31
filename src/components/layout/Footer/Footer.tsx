// outsource dependencies
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./Footer.module.scss";

export default function Footer() {
    const t = useTranslations("Footer");
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <span>{t("copyright", { year })}</span>
            <span className={styles.built}>{t("built")}</span>
        </footer>
    );
}
