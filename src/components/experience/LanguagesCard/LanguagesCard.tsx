// outsource dependencies
import { useTranslations } from "next-intl";

// local dependencies
import { languages } from "@/content/languages";
import styles from "./LanguagesCard.module.scss";

export default function LanguagesCard() {
    const t = useTranslations("Experience");

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>{t("languages.title")}</h3>
            <ul className={styles.list}>
                {languages.map(({ code, level }) => (
                    <li key={code} className={styles.item}>
                        {t(`languages.${code}`)}
                        {" — "}
                        {level === "native" ? t("languages.native") : level}
                    </li>
                ))}
            </ul>
        </div>
    );
}
