"use client";

// outsource dependencies
import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

// local dependencies
import { navigateTo } from "@/lib/navigate";
import styles from "./LocaleSwitch.module.scss";
import { getPathname, usePathname } from "@/i18n/navigation";

const TRANSITION_MS = 150; // mirrors --duration-fast; kept in sync manually

export default function LocaleSwitch() {
    const t = useTranslations("LocaleSwitch");
    const locale = useLocale();
    const pathname = usePathname();

    const ukHref = getPathname({ href: pathname, locale: "uk" });
    const enHref = getPathname({ href: pathname, locale: "en" });

    const [activeLocale, setActiveLocale] = useState<string>(locale);
    const indicatorRef = useRef<HTMLDivElement>(null);

    function handleClick(
        e: React.MouseEvent<HTMLAnchorElement>,
        targetLocale: string,
        href: string,
    ) {
        if (
            e.button !== 0 ||
            e.ctrlKey ||
            e.metaKey ||
            e.shiftKey ||
            e.altKey
        ) {
            return;
        }
        if (targetLocale === locale) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        e.preventDefault();
        setActiveLocale(targetLocale);

        let done = false;
        const navigate = () => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            navigateTo(href);
        };

        const indicator = indicatorRef.current;
        const onTransitionEnd = (ev: TransitionEvent) => {
            if (ev.propertyName !== "transform") {
                indicator?.addEventListener("transitionend", onTransitionEnd, {
                    once: true,
                });
                return;
            }
            navigate();
        };
        indicator?.addEventListener("transitionend", onTransitionEnd, {
            once: true,
        });

        const timer = setTimeout(navigate, TRANSITION_MS);
    }

    return (
        <nav aria-label={t("label")} className={styles.root}>
            <svg
                className={styles.globe}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <div className={styles.container}>
                <div className={styles.track} data-locale={activeLocale}>
                    <div
                        className={styles.indicator}
                        ref={indicatorRef}
                        aria-hidden="true"
                    >
                        <div className={styles.flag} />
                    </div>
                    <a
                        href={ukHref}
                        lang="uk"
                        hrefLang="uk"
                        className={styles.segment}
                        aria-label={t("nameUk")}
                        aria-current={locale === "uk" ? "true" : undefined}
                        onClick={(e) => handleClick(e, "uk", ukHref)}
                    >
                        {t("uk")}
                    </a>
                    <a
                        href={enHref}
                        lang="en"
                        hrefLang="en"
                        className={styles.segment}
                        aria-label={t("nameEn")}
                        aria-current={locale === "en" ? "true" : undefined}
                        onClick={(e) => handleClick(e, "en", enHref)}
                    >
                        {t("en")}
                    </a>
                </div>
            </div>
        </nav>
    );
}
