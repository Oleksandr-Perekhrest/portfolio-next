// outsource dependencies
import type { Metadata } from "next";

// local dependencies
import "./globals.scss";
import { themeScript } from "@/lib/theme";
import { geistSans, geistMono } from "./fonts";
import styles from "./global-not-found.module.scss";

export const metadata: Metadata = {
    title: "404 — Page not found",
};

export default function GlobalNotFound() {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            data-scroll-behavior="smooth"
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body>
                <main className={styles.container}>
                    <h1 className={styles.title}>Page not found</h1>
                    <p className={styles.description}>
                        The page you are looking for does not exist.
                    </p>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/" className={styles.link}>
                        Go home
                    </a>
                </main>
            </body>
        </html>
    );
}
