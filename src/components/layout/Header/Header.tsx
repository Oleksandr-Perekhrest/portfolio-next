"use client";

// outsource dependencies
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./Header.module.scss";
import { useIsScrolled } from "./useIsScrolled";
import ThemeSwitch from "@/components/ThemeSwitch/ThemeSwitch";
import LocaleSwitch from "@/components/LocaleSwitch/LocaleSwitch";

export default function Header() {
    const t = useTranslations("Header");
    const isScrolled = useIsScrolled();

    return (
        <header className={styles.header} data-compact={String(isScrolled)}>
            <div className={styles.inner}>
                <a
                    href="#top"
                    className={styles.brand}
                    aria-label={t("brand.name")}
                >
                    <span className={styles.brandFull} aria-hidden="true">
                        <span className={styles.name}>{t("brand.name")}</span>
                        <span className={styles.role}>{t("brand.role")}</span>
                    </span>
                    <span className={styles.brandCompact} aria-hidden="true">
                        {t("brand.initials")}
                    </span>
                </a>
                <div className={styles.actions}>
                    <nav aria-label={t("nav.aria")} className={styles.nav}>
                        <ul className={styles.navList}>
                            <li>
                                <a
                                    href="#experience"
                                    className={styles.navLink}
                                >
                                    {t("nav.experience")}
                                </a>
                            </li>
                            <li>
                                <a href="#about" className={styles.navLink}>
                                    {t("nav.about")}
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className={styles.navLink}>
                                    {t("nav.contact")}
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div className={styles.controls}>
                        <LocaleSwitch />
                        <ThemeSwitch />
                    </div>
                </div>
            </div>
        </header>
    );
}
