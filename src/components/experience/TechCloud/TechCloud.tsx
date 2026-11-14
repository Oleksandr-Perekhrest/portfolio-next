"use client";

// outsource dependencies
import { Dialog } from "radix-ui";
import { useTranslations } from "next-intl";

// local dependencies
import { getCloud } from "@/content/tech";
import styles from "./TechCloud.module.scss";
import { useCloudLayout } from "./useCloudLayout";

type TechCloudProps = {
    area: "frontend" | "backend";
};

const tierStyles: Record<1 | 2 | 3 | 4, string> = {
    1: styles.level1!,
    2: styles.level2!,
    3: styles.level3!,
    4: styles.level4!,
};

export default function TechCloud({ area }: TechCloudProps) {
    const t = useTranslations("Experience");
    const title = area === "frontend" ? "Frontend" : "Backend";

    const items = getCloud(area);
    const { bodyRef, listRef, state } = useCloudLayout();

    return (
        <>
            <Dialog.Overlay className={styles.overlayBg} />
            <Dialog.Content
                className={styles.overlay}
                aria-describedby={undefined}
            >
                <div className={styles.header}>
                    <Dialog.Title className={styles.title}>
                        {title}
                    </Dialog.Title>
                    <Dialog.Close
                        className={styles.closeBtn}
                        aria-label={t("cloud.close")}
                    >
                        <svg
                            aria-hidden
                            width={18}
                            height={18}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </Dialog.Close>
                </div>
                <div className={styles.body} ref={bodyRef}>
                    <ul
                        ref={listRef}
                        className={styles.list}
                        data-cloud-state={state}
                        aria-label={t("cloud.list", { area: title })}
                    >
                        {items.map((item) => {
                            const icon =
                                item.area !== "shared" ? item.icon : undefined;
                            const tierClass =
                                item.area === "shared"
                                    ? styles.shared
                                    : tierStyles[item.level];

                            return (
                                <li
                                    key={`${item.area}-${item.name}`}
                                    className={`${styles.item} ${tierClass}`}
                                >
                                    {icon && (
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="1em"
                                            height="1em"
                                            fill="currentColor"
                                            aria-hidden
                                        >
                                            <path d={icon.path} />
                                        </svg>
                                    )}
                                    {item.name}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </Dialog.Content>
        </>
    );
}
