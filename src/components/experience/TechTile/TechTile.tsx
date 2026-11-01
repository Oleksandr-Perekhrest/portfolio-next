"use client";

// outsource dependencies
import { Dialog } from "radix-ui";
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./TechTile.module.scss";
import TechCloud from "../TechCloud/TechCloud";
import { getTileSummary } from "@/content/tech";

type TechTileProps = {
    area: "frontend" | "backend";
};

export default function TechTile({ area }: TechTileProps) {
    const t = useTranslations("Experience");
    const { names, restCount } = getTileSummary(area);
    const title = area === "frontend" ? "Frontend" : "Backend";

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button
                    type="button"
                    className={styles.tile}
                    aria-label={t("showAll", { area: title })}
                >
                    <div className={styles.topRow}>
                        <span className={styles.title}>{title}</span>
                        <svg
                            aria-hidden
                            width={18}
                            height={18}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className={styles.icon}
                        >
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                    </div>
                    <p className={styles.summary}>{names.join(" · ")}</p>
                    <p className={styles.more}>
                        {t("more", { count: restCount })}
                    </p>
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <TechCloud area={area} />
            </Dialog.Portal>
        </Dialog.Root>
    );
}
