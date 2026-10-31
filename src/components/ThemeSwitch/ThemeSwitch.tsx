"use client";

// outsource dependencies
import { Switch } from "radix-ui";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

// local dependencies
import { setTheme } from "@/lib/theme";
import styles from "./ThemeSwitch.module.scss";

function subscribe(callback: () => void): () => void {
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
}

function getSnapshot(): boolean {
    return document.documentElement.dataset.theme === "dark";
}

function getServerSnapshot(): boolean {
    return false;
}

export default function ThemeSwitch() {
    const t = useTranslations("ThemeSwitch");
    const isDark = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
    );

    return (
        <Switch.Root
            className={styles.root}
            checked={isDark}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label={t("aria")}
        >
            <Switch.Thumb className={styles.thumb}>
                <svg
                    className={styles.sun}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                <svg
                    className={styles.moon}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            </Switch.Thumb>
        </Switch.Root>
    );
}
