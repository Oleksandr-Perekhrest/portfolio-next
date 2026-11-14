"use client";

// outsource dependencies
import Image from "next/image";
import { useTranslations } from "next-intl";

// local dependencies
import { useGallery } from "../useGallery";
import GalleryNav from "../GalleryNav/GalleryNav";
import styles from "./ProjectGallery.module.scss";
import ButtonLink from "@/components/ButtonLink/ButtonLink";
import { projects, type Project } from "@/content/projects";
import {
    commercial,
    roleLabels,
    type CommercialProject,
} from "@/content/commercial";

type CommercialSlide = { kind: "commercial"; item: CommercialProject };
type PersonalSlide = { kind: "personal"; project: Project };
type Slide = CommercialSlide | PersonalSlide;

type ProjectGalleryProps = {
    commercialItems?: readonly CommercialProject[];
    personalProjects?: readonly Project[];
};

export default function ProjectGallery({
    commercialItems = commercial,
    personalProjects = projects,
}: ProjectGalleryProps) {
    const t = useTranslations("Experience");
    const slides: readonly Slide[] = [
        ...commercialItems.map((item) => ({
            kind: "commercial" as const,
            item,
        })),
        ...personalProjects.map((project) => ({
            kind: "personal" as const,
            project,
        })),
    ];
    const count = slides.length;
    const { index, canPrev, canNext, prev, next } = useGallery(count);
    const isMultiple = count > 1;

    if (count === 0) return null;

    const activeSlide = slides[index];
    if (!activeSlide) return null;

    return (
        <div className={styles.card} data-testid="project-gallery">
            <div className={styles.topRow}>
                <div className={styles.topLeft}>
                    <span className={styles.label} aria-live="polite">
                        {isMultiple
                            ? t.rich("projectCounter", {
                                  current: index + 1,
                                  total: count,
                                  counter: (chunks) => (
                                      <span className={styles.counter}>
                                          {chunks}
                                      </span>
                                  ),
                              })
                            : t("featured")}
                    </span>
                    {activeSlide.kind === "commercial" ? (
                        <span
                            className={`${styles.badge} ${styles.badgeCommercial}`}
                            title={t("commercial.ndaHint")}
                        >
                            {t("commercialBadge")}
                            <span className={styles.badgeHidden}>
                                {t("commercial.ndaHint")}
                            </span>
                        </span>
                    ) : (
                        <span
                            className={`${styles.badge} ${styles.badgePersonal}`}
                        >
                            {t("personalBadge")}
                        </span>
                    )}
                </div>
                {isMultiple && (
                    <GalleryNav
                        tone="default"
                        prevLabel={t("prevProject")}
                        nextLabel={t("nextProject")}
                        canPrev={canPrev}
                        canNext={canNext}
                        onPrev={prev}
                        onNext={next}
                    />
                )}
            </div>
            <div className={styles.items}>
                {slides.map((slide, i) => {
                    const active = i === index;
                    if (slide.kind === "commercial") {
                        const { item } = slide;
                        return (
                            <div
                                key={item.id}
                                className={`${styles.item}${active ? "" : ` ${styles.hidden}`}`}
                                aria-hidden={active ? undefined : true}
                                inert={active ? undefined : true}
                            >
                                <h3 className={styles.name}>
                                    {t(`commercial.items.${item.id}`)}
                                </h3>
                                <p className={styles.description}>
                                    {roleLabels[item.role]}
                                </p>
                                <div
                                    className={`${styles.imageFrame} ${styles.placeholder}`}
                                >
                                    <svg
                                        aria-hidden="true"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect
                                            x="3"
                                            y="11"
                                            width="18"
                                            height="11"
                                            rx="2"
                                            ry="2"
                                        />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <span className={styles.placeholderLabel}>
                                        {t("commercialBadge")}
                                    </span>
                                    <span className={styles.placeholderHint}>
                                        {t("commercial.ndaHint")}
                                    </span>
                                </div>
                                <ul className={styles.tags}>
                                    {item.stack.map((tag) => (
                                        <li key={tag} className={styles.tag}>
                                            {tag}
                                        </li>
                                    ))}
                                </ul>
                                <div className={styles.bottomRow}>
                                    {isMultiple && (
                                        <div
                                            className={styles.dots}
                                            aria-hidden="true"
                                            data-testid="gallery-dots"
                                        >
                                            {Array.from(
                                                { length: count },
                                                (_, j) => (
                                                    <span
                                                        key={j}
                                                        className={
                                                            j === index
                                                                ? styles.dotActive
                                                                : styles.dot
                                                        }
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    }
                    const { project } = slide;
                    return (
                        <div
                            key={project.id}
                            className={`${styles.item}${active ? "" : ` ${styles.hidden}`}`}
                            aria-hidden={active ? undefined : true}
                            inert={active ? undefined : true}
                        >
                            <h3 className={styles.name}>{project.name}</h3>
                            <p className={styles.description}>
                                {t(`projects.${project.id}.description`)}
                            </p>
                            <div className={styles.imageFrame}>
                                <Image
                                    src={project.image}
                                    alt={t(`projects.${project.id}.imageAlt`)}
                                    fill
                                    sizes="(max-width: 900px) 100vw, 552px"
                                    style={{
                                        objectFit: "cover",
                                        objectPosition: "top",
                                    }}
                                />
                            </div>
                            <ul className={styles.tags}>
                                {project.stack.map((tag) => (
                                    <li key={tag} className={styles.tag}>
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.bottomRow}>
                                <div className={styles.links}>
                                    <ButtonLink
                                        href={project.demoUrl}
                                        variant="inverse"
                                        size="sm"
                                        external
                                    >
                                        {t("demo")}
                                    </ButtonLink>
                                    <ButtonLink
                                        href={project.repoUrl}
                                        variant="secondary"
                                        size="sm"
                                        external
                                    >
                                        {t("github")}
                                    </ButtonLink>
                                </div>
                                {isMultiple && (
                                    <div
                                        className={styles.dots}
                                        aria-hidden="true"
                                        data-testid="gallery-dots"
                                    >
                                        {Array.from(
                                            { length: count },
                                            (_, j) => (
                                                <span
                                                    key={j}
                                                    className={
                                                        j === index
                                                            ? styles.dotActive
                                                            : styles.dot
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
