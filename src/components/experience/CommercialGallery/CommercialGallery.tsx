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

    return (
        <div className={styles.card} data-testid="commercial-card">
            <div className={styles.topRow}>
                <span
                    className={styles.label}
                    aria-live="polite"
                    data-testid="commercial-label"
                >
                    {t.rich("commercial.label", {
                        current: index + 1,
                        total: count,
                        counter: (chunks) => (
                            <span className={styles.counter}>{chunks}</span>
                        ),
                    })}
                </span>
                <span className={styles.nda} title={t("commercial.ndaHint")}>
                    {t("commercial.nda")}
                    <span className={styles.ndaHidden}>
                        {t("commercial.ndaHint")}
                    </span>
                </span>
            </div>
            <div className={styles.items}>
                {commercial.map((item, i) => {
                    const active = i === index;
                    return (
                        <div
                            key={item.id}
                            className={active ? styles.item : styles.itemHidden}
                            data-testid="commercial-item"
                            aria-hidden={active ? undefined : true}
                            inert={active ? undefined : true}
                        >
                            <p className={styles.domain}>
                                {t(`commercial.items.${item.id}`)}
                            </p>
                            <p className={styles.role}>
                                {roleLabels[item.role]}
                            </p>
                            <p className={styles.stack}>
                                {item.stack.join(" · ")}
                            </p>
                        </div>
                    );
                })}
            </div>
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
