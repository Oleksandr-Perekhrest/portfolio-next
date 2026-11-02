"use client";

// outsource dependencies
import { Dialog } from "radix-ui";
import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

// local dependencies
import { getCvPath } from "@/content/cv";
import { breakpoints } from "@/lib/breakpoints";
import CvDialog from "@/components/CvDialog/CvDialog";
import ButtonLink from "@/components/ButtonLink/ButtonLink";

export default function CvActions() {
    const t = useTranslations("Hero");
    const pdfPath = getCvPath(useLocale());
    const [cvOpen, setCvOpen] = useState(false);
    const viewCvRef = useRef<HTMLAnchorElement>(null);

    return (
        <>
            <ButtonLink
                href={pdfPath}
                variant="secondary"
                external
                ref={viewCvRef}
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
                    <CvDialog
                        pdfPath={pdfPath}
                        // No Dialog.Trigger here — focus return must be manual
                        onCloseAutoFocus={(e) => {
                            e.preventDefault();
                            viewCvRef.current?.focus();
                        }}
                    />
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}
