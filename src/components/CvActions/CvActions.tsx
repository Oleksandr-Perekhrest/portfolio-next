"use client";

// outsource dependencies
import { useState } from "react";
import { Dialog } from "radix-ui";
import { useLocale, useTranslations } from "next-intl";

// local dependencies
import { routing } from "@/i18n/routing";
import { getCvPath } from "@/content/cv";
import { breakpoints } from "@/lib/breakpoints";
import CvDialog from "@/components/CvDialog/CvDialog";
import ButtonLink from "@/components/ButtonLink/ButtonLink";

export default function CvActions() {
    const t = useTranslations("Hero");
    const localeStr = useLocale();
    const locale =
        routing.locales.find((l) => l === localeStr) ?? routing.defaultLocale;
    const pdfPath = getCvPath(locale);
    const [cvOpen, setCvOpen] = useState(false);

    return (
        <>
            <ButtonLink
                href={pdfPath}
                variant="secondary"
                external
                onClick={(e) => {
                    if (
                        window.matchMedia(`(width >= ${breakpoints.tablet}px)`)
                            .matches &&
                        e.button === 0 &&
                        !e.metaKey &&
                        !e.ctrlKey &&
                        !e.shiftKey &&
                        !e.altKey
                    ) {
                        e.preventDefault();
                        setCvOpen(true);
                    }
                }}
            >
                {t("cv.viewCv")}
            </ButtonLink>
            <ButtonLink href={pdfPath} variant="secondary" download>
                {t("cv.downloadPdf")}
            </ButtonLink>
            <Dialog.Root open={cvOpen} onOpenChange={setCvOpen}>
                <Dialog.Portal>
                    <CvDialog pdfPath={pdfPath} />
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}
