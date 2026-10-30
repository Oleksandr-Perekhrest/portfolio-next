"use client";

// local dependencies
import styles from "./Header.module.scss";
import { useIsScrolled } from "./useIsScrolled";
import ThemeSwitch from "@/components/ThemeSwitch/ThemeSwitch";

export default function Header() {
    const isScrolled = useIsScrolled();

    return (
        <header className={styles.header} data-compact={String(isScrolled)}>
            <div className={styles.inner}>
                <a
                    href="#top"
                    className={styles.brand}
                    aria-label="Oleksandr Perekhrest"
                >
                    <span className={styles.brandFull} aria-hidden="true">
                        <span className={styles.name}>
                            Oleksandr Perekhrest
                        </span>
                        <span className={styles.role}>Web Engineer</span>
                    </span>
                    <span className={styles.brandCompact} aria-hidden="true">
                        OP
                    </span>
                </a>
                <div className={styles.actions}>
                    <nav aria-label="Main" className={styles.nav}>
                        <ul className={styles.navList}>
                            <li>
                                <a
                                    href="#experience"
                                    className={styles.navLink}
                                >
                                    Experience
                                </a>
                            </li>
                            <li>
                                <a href="#about" className={styles.navLink}>
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className={styles.navLink}>
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <ThemeSwitch />
                </div>
            </div>
        </header>
    );
}
