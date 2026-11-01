"use client";

// outsource dependencies
import { useTranslations } from "next-intl";

// local dependencies
import { useGallery } from "../useGallery";
import GalleryNav from "../GalleryNav/GalleryNav";
import styles from "./CommercialGallery.module.scss";
import { commercial, roleLabels } from "@/content/commercial";

export default function CommercialGallery() {
    const t = useTranslations("Experience");
    const count = commercial.length;
    const { index, canPrev, canNext, prev, next } = useGallery(count);
    const item = commercial[index] ?? commercial[0];

    if (!item) return null;

    return (
        <div className={styles.card}>
            <div className={styles.topRow}>
                <span className={styles.label} aria-live="polite">
                    {t("commercial.label", {
                        current: index + 1,
                        total: count,
                    })}
                </span>
                <span className={styles.nda} title={t("commercial.ndaHint")}>
                    {t("commercial.nda")}
                    <span className={styles.ndaHidden}>
                        {t("commercial.ndaHint")}
                    </span>
                </span>
            </div>
            <p className={styles.domain}>{t(`commercial.items.${item.id}`)}</p>
            <p className={styles.role}>{roleLabels[item.role]}</p>
            <p className={styles.stack}>{item.stack.join(" · ")}</p>
            <div className={styles.bottomRow}>
                <div className={styles.dots} aria-hidden="true">
                    {Array.from({ length: count }, (_, i) => (
                        <span
                            key={i}
                            className={
                                i === index ? styles.dotActive : styles.dot
                            }
                        />
                    ))}
                </div>
                <GalleryNav
                    tone="onAccent"
                    prevLabel={t("commercial.prev")}
                    nextLabel={t("commercial.next")}
                    canPrev={canPrev}
                    canNext={canNext}
                    onPrev={prev}
                    onNext={next}
                />
            </div>
        </div>
    );
}
