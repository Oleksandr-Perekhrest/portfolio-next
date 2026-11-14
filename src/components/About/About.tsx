"use client";

// outsource dependencies
import { Collapsible } from "radix-ui";
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./About.module.scss";
import { journey } from "@/content/journey";
import { languages } from "@/content/languages";
import SectionTitle from "@/components/SectionTitle/SectionTitle";

export default function About() {
    const t = useTranslations("About");

    return (
        <section id="about" className={styles.section}>
            <SectionTitle>{t("label")}</SectionTitle>
            <div className={styles.card}>
                <div className={styles.languages}>
                    <h3 className={styles.languagesHeading}>
                        {t("languages.title")}
                    </h3>
                    <ul className={styles.languagesList}>
                        {languages.map(({ code, level }) => (
                            <li key={code} className={styles.languagesItem}>
                                {t(`languages.${code}`)}
                                {" — "}
                                <span className={styles.languagesLevel}>
                                    {level === "native"
                                        ? t("languages.native")
                                        : level}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <Collapsible.Root>
                    <h3 className={styles.heading}>
                        <Collapsible.Trigger className={styles.trigger}>
                            <span className={styles.triggerLeft}>
                                <span className={styles.title}>
                                    {t("title")}
                                </span>
                                <span className={styles.summary}>
                                    {t("summary")}
                                </span>
                            </span>
                            <span className={styles.chevronCircle} aria-hidden>
                                <svg
                                    width={18}
                                    height={18}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </span>
                        </Collapsible.Trigger>
                    </h3>
                    <Collapsible.Content forceMount className={styles.content}>
                        <div className={styles.contentInner}>
                            <div className={styles.contentBody}>
                                <p className={styles.intro}>{t("intro")}</p>
                                <ol className={styles.journey}>
                                    {journey.map((entry, index) => {
                                        const isAccent =
                                            index >= journey.length - 2;
                                        return (
                                            <li
                                                key={entry.id}
                                                className={`${styles.step}${isAccent ? ` ${styles.stepAccent}` : ""}`}
                                            >
                                                <span className={styles.year}>
                                                    {entry.year === "now"
                                                        ? t("now")
                                                        : entry.year}
                                                </span>
                                                <span
                                                    className={styles.stepTitle}
                                                >
                                                    {t(`journey.${entry.id}`)}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>
                        </div>
                    </Collapsible.Content>
                </Collapsible.Root>
            </div>
        </section>
    );
}
