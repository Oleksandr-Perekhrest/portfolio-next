// outsource dependencies
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./page.module.scss";
import Hero from "@/components/Hero/Hero";
import Experience from "@/components/experience/Experience/Experience";

export default function Home() {
    const tAbout = useTranslations("About");
    const tContact = useTranslations("Contact");

    return (
        <>
            <Hero />
            <Experience />
            <section id="about" className={styles.section}>
                <h2 className={styles.eyebrow}>{tAbout("label")}</h2>
            </section>
            <section id="contact" className={styles.section}>
                <h2 className={styles.eyebrow}>{tContact("title")}</h2>
            </section>
        </>
    );
}
