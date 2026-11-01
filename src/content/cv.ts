// outsource dependencies
import type { Locale } from "next-intl";

const cvPaths: Record<Locale, string> = {
    en: "/cv/CV-Perekhrest-Oleksandr-Web-Developer-EN.pdf",
    uk: "/cv/CV-Perekhrest-Oleksandr-Web-Developer-UA.pdf",
};

export function getCvPath(locale: Locale): string {
    return cvPaths[locale];
}
