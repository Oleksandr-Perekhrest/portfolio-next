"use client";

// local dependencies
import styles from "./GalleryNav.module.scss";

type GalleryNavProps = {
    tone: "default" | "onAccent";
    prevLabel: string;
    nextLabel: string;
    canPrev: boolean;
    canNext: boolean;
    onPrev: () => void;
    onNext: () => void;
};

export default function GalleryNav({
    tone,
    prevLabel,
    nextLabel,
    canPrev,
    canNext,
    onPrev,
    onNext,
}: GalleryNavProps) {
    return (
        <div className={styles.nav}>
            <button
                type="button"
                className={`${styles.btn} ${styles[tone]}`}
                aria-label={prevLabel}
                onClick={onPrev}
                disabled={!canPrev}
            >
                <svg
                    aria-hidden
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>
            <button
                type="button"
                className={`${styles.btn} ${styles[tone]}`}
                aria-label={nextLabel}
                onClick={onNext}
                disabled={!canNext}
            >
                <svg
                    aria-hidden
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
        </div>
    );
}
