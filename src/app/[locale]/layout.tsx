// outsource dependencies
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

// local dependencies
import "../globals.scss";
import { siteUrl } from "@/lib/site";
import { routing } from "@/i18n/routing";
import styles from "./layout.module.scss";
import { themeScript } from "@/lib/theme";
import { geistSans, geistMono } from "@/app/fonts";
import Footer from "@/components/layout/Footer/Footer";
import Header from "@/components/layout/Header/Header";
import { ogLocaleMap, buildAlternates } from "@/lib/metadata";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });
    const { canonical, languages } = buildAlternates(locale, routing.locales);
    const ogLoc = ogLocaleMap[locale] ?? locale;
    const altLocale = (routing.locales as readonly string[])
        .filter((l) => l !== locale)
        .map((l) => ogLocaleMap[l] ?? l);

    return {
        metadataBase: new URL(siteUrl),
        title: t("title"),
        description: t("description"),
        alternates: { canonical, languages },
        openGraph: {
            title: t("title"),
            description: t("description"),
            url: `/${locale}`,
            locale: ogLoc,
            alternateLocale: altLocale,
            type: "website",
        },
    };
}

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
