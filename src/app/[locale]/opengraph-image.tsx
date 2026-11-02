// outsource dependencies
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { getTranslations } from "next-intl/server";

// local dependencies
import { routing } from "@/i18n/routing";
import enMessages from "../../../messages/en.json";
import ukMessages from "../../../messages/uk.json";

const geistRegular = await readFile(
    join(process.cwd(), "assets/og/Geist-Regular.ttf"),
);
const geistBold = await readFile(
    join(process.cwd(), "assets/og/Geist-Bold.ttf"),
);

// getTranslations cannot be called here: generateImageMetadata acts like
// generateStaticParams and next/root-params has no parent context at that
// point, crashing the build. Read messages JSON directly instead.
const altByLocale: Record<(typeof routing.locales)[number], string> = {
    en: enMessages.Metadata.title,
    uk: ukMessages.Metadata.title,
};

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata({
    params,
}: {
    params: { locale: (typeof routing.locales)[number] };
}) {
    return [{ id: "main", alt: altByLocale[params.locale] }];
}

export default async function Image({
    params,
}: {
    params: Promise<{ locale: (typeof routing.locales)[number] }>;
    id: Promise<string>;
}) {
    const { locale } = await params;
    const [tHeader, tHero] = await Promise.all([
        getTranslations({ locale, namespace: "Header" }),
        getTranslations({ locale, namespace: "Hero" }),
    ]);

    const brandName = tHeader("brand.name");
    const heroTitle = tHero("title");
    const keywords = tHero("keywords");
    const domain = "o-perekhrest.vercel.app";

    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f4f2ee",
                padding: "72px",
                fontFamily: "Geist",
            }}
        >
            <div
                style={{
                    fontSize: 32,
                    fontWeight: 400,
                    color: "#666666",
                }}
            >
                {brandName}
            </div>

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        fontSize: 96,
                        fontWeight: 700,
                        color: "#1a1a1a",
                        letterSpacing: "-3.84px",
                        lineHeight: 1,
                    }}
                >
                    {heroTitle}
                </div>
                <div
                    style={{
                        fontSize: 36,
                        fontWeight: 400,
                        color: "#4d4d4d",
                        marginTop: 24,
                    }}
                >
                    {keywords}
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                }}
            >
                <div
                    style={{
                        width: 64,
                        height: 6,
                        backgroundColor: "#0a66c2",
                        borderRadius: 3,
                    }}
                />
                <div
                    style={{
                        fontSize: 28,
                        fontWeight: 400,
                        color: "#666666",
                    }}
                >
                    {domain}
                </div>
            </div>
        </div>,
        {
            ...size,
            fonts: [
                {
                    name: "Geist",
                    data: geistRegular,
                    style: "normal",
                    weight: 400,
                },
                {
                    name: "Geist",
                    data: geistBold,
                    style: "normal",
                    weight: 700,
                },
            ],
        },
    );
}
