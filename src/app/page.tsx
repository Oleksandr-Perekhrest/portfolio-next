// local dependencies
import styles from "./page.module.scss";

export default function Home() {
    return (
        <>
            <section className={styles.hero}>
                <h1>Alex Perekhrest</h1>
                <p>Web Engineer — site under construction</p>
            </section>
            <section id="experience" className={styles.section}>
                <h2 className={styles.eyebrow}>Experience</h2>
            </section>
            <section id="about" className={styles.section}>
                <h2 className={styles.eyebrow}>About</h2>
            </section>
            <section id="contact" className={styles.section}>
                <h2 className={styles.eyebrow}>Contact</h2>
            </section>
        </>
    );
}
