// outsource dependencies
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

// local dependencies
import "../globals.scss";
import { routing } from "@/i18n/routing";
import styles from "./layout.module.scss";
import { themeScript } from "@/lib/theme";
import { geistSans, geistMono } from "@/app/fonts";
import Footer from "@/components/layout/Footer/Footer";
import Header from "@/components/layout/Header/Header";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export const metadata: Metadata = {
    title: "Alex Perekhrest — Web Engineer",
    description: "Personal portfolio of Alex Perekhrest, web engineer.",
};

export default async function LocaleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // request.ts validates the locale and calls notFound() for unknown values;
    // getLocale() propagates that error or returns the validated locale.
    const locale = await getLocale();

    return (
        <html
            lang={locale}
            suppressHydrationWarning
            data-scroll-behavior="smooth"
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body>
                <NextIntlClientProvider>
                    <Header />
                    <main id="top" className={styles.main}>
                        {children}
                    </main>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
