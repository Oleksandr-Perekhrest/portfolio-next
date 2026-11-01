// outsource dependencies
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./Experience.module.scss";
import ProjectGallery from "../ProjectGallery/ProjectGallery";

export default function Experience() {
    const t = useTranslations("Experience");

    return (
        <section id="experience" className={styles.section}>
            <h2 className={styles.title}>{t("title")}</h2>
            <div className={styles.grid}>
                <ProjectGallery />
            </div>
        </section>
    );
}
