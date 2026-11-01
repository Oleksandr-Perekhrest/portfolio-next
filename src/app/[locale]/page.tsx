// outsource dependencies
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./page.module.scss";
import Hero from "@/components/Hero/Hero";

export default function Home() {
    const tExp = useTranslations("Experience");
    const tAbout = useTranslations("About");
    const tContact = useTranslations("Contact");

    return (
        <>
            <Hero />
            <section id="experience" className={styles.section}>
                <h2 className={styles.eyebrow}>{tExp("title")}</h2>
            </section>
            <section id="about" className={styles.section}>
                <h2 className={styles.eyebrow}>{tAbout("label")}</h2>
            </section>
            <section id="contact" className={styles.section}>
                <h2 className={styles.eyebrow}>{tContact("title")}</h2>
            </section>
        </>
    );
}
