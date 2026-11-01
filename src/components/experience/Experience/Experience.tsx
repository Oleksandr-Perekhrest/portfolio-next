// outsource dependencies
import { useTranslations } from "next-intl";

// local dependencies
import TechTile from "../TechTile/TechTile";
import styles from "./Experience.module.scss";
import LanguagesCard from "../LanguagesCard/LanguagesCard";
import ProjectGallery from "../ProjectGallery/ProjectGallery";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import CommercialGallery from "../CommercialGallery/CommercialGallery";

export default function Experience() {
    const t = useTranslations("Experience");

    return (
        <section id="experience" className={styles.section}>
            <SectionTitle>{t("title")}</SectionTitle>
            <div className={styles.grid}>
                <ProjectGallery />
                <TechTile area="frontend" />
                <TechTile area="backend" />
                <CommercialGallery />
                <LanguagesCard />
            </div>
        </section>
    );
}
