"use client";

// outsource dependencies
import { Collapsible } from "radix-ui";
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./About.module.scss";
import { journey } from "@/content/journey";

export default function About() {
    const t = useTranslations("About");

    return (
        <section id="about" className={styles.section}>
            <div className={styles.card}>
                <Collapsible.Root>
                    <h2 className={styles.heading}>
                        <Collapsible.Trigger className={styles.trigger}>
                            <span className={styles.triggerLeft}>
                                <span className={styles.label}>
                                    {t("label")}
                                </span>
                                <span className={styles.title}>
                                    {t("title")}
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
                    </h2>
                    <Collapsible.Content forceMount className={styles.content}>
                        <p className={styles.intro}>{t("intro")}</p>
                        <ol className={styles.journey}>
                            {journey.map((entry, index) => {
                                const isAccent = index >= journey.length - 2;
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
                                        <span className={styles.stepTitle}>
                                            {t(
                                                `journey.${entry.id}` as Parameters<
                                                    typeof t
                                                >[0],
                                            )}
                                        </span>
                                    </li>
                                );
                            })}
                        </ol>
                    </Collapsible.Content>
                </Collapsible.Root>
            </div>
        </section>
    );
}
