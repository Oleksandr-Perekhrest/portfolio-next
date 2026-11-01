// local dependencies
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

const cvPaths: Record<Locale, string> = {
    en: "/cv/CV-Perekhrest-Oleksandr-Web-Developer-EN.pdf",
    uk: "/cv/CV-Perekhrest-Oleksandr-Web-Developer-UA.pdf",
};

export function getCvPath(locale: string): string {
    return cvPaths[locale as Locale] ?? cvPaths["en"];
}
