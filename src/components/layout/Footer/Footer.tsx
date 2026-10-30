// local dependencies
import styles from "./Footer.module.scss";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <span>{`© ${year} Oleksandr Perekhrest`}</span>
            <span className={styles.built}>
                Built with Next.js · SCSS · Radix
            </span>
        </footer>
    );
}
