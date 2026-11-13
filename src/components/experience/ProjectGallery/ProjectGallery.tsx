"use client";

// outsource dependencies
import Image from "next/image";
import { useTranslations } from "next-intl";

// local dependencies
import { useGallery } from "../useGallery";
import GalleryNav from "../GalleryNav/GalleryNav";
import styles from "./ProjectGallery.module.scss";
import ButtonLink from "@/components/ButtonLink/ButtonLink";
import { type Project, projects as defaultProjects } from "@/content/projects";

export default function ProjectGallery({
    projects = defaultProjects,
}: {
    projects?: readonly Project[];
} = {}) {
    const t = useTranslations("Experience");
    const count = projects.length;
    const { index, canPrev, canNext, prev, next } = useGallery(count);
    const isMultiple = count > 1;

    if (count === 0) return null;

    return (
        <div className={styles.card}>
            <div className={styles.topRow}>
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
                {projects.map((project, i) => {
                    const active = i === index;
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
                                    style={{ objectFit: "cover" }}
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
