// outsource dependencies
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./page.module.scss";

export default function Home() {
    const t = useTranslations("Home");

    return (
        <>
            <section className={styles.hero}>
                <h1>{t("heroName")}</h1>
                <p>{t("heroTagline")}</p>
            </section>
            <section id="experience" className={styles.section}>
                <h2 className={styles.eyebrow}>{t("experience")}</h2>
            </section>
            <section id="about" className={styles.section}>
                <h2 className={styles.eyebrow}>{t("about")}</h2>
            </section>
            <section id="contact" className={styles.section}>
                <h2 className={styles.eyebrow}>{t("contact")}</h2>
            </section>
        </>
    );
}
