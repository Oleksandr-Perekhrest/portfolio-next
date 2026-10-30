// outsource dependencies
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// local dependencies
import styles from "./layout.module.scss";
import { themeScript } from "@/lib/theme";
import Footer from "@/components/layout/Footer/Footer";
import Header from "@/components/layout/Header/Header";
import "./globals.scss";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Alex Perekhrest — Web Engineer",
    description: "Personal portfolio of Alex Perekhrest, web engineer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
                <Header />
                <main id="top" className={styles.main}>
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
