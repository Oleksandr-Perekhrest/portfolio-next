// outsource dependencies
import { useTranslations } from "next-intl";

// local dependencies
import styles from "./page.module.scss";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Experience from "@/components/experience/Experience/Experience";

export default function Home() {
    const tContact = useTranslations("Contact");

    return (
        <>
            <Hero />
            <Experience />
            <About />
            <section id="contact" className={styles.section}>
                <h2 className={styles.eyebrow}>{tContact("title")}</h2>
            </section>
        </>
    );
}
