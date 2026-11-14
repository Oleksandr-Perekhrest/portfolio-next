// outsource dependencies
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./Hero.module.scss";
import CvActions from "@/components/CvActions/CvActions";
import ButtonLink from "@/components/ButtonLink/ButtonLink";

export default function Hero() {
    const t = useTranslations("Hero");

    return (
        <section className={styles.hero}>
            <div className={styles.inner}>
                <div className={styles.content}>
                    <h1 className={styles.title}>{t("title")}</h1>
                    <p className={styles.keywords}>{t("keywords")}</p>
                    <p className={styles.lead}>{t("lead")}</p>
                </div>
                <div className={styles.actions}>
                    <ButtonLink href="#contact" variant="primary">
                        {t("contact")}
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
                    <CvActions />
                </div>
            </div>
        </section>
    );
}
