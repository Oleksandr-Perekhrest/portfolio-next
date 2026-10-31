export const ogLocaleMap: Record<string, string> = {
    en: "en_US",
    uk: "uk_UA",
};

export function buildAlternates(locale: string, locales: readonly string[]) {
    const languages: Record<string, string> = { "x-default": "/" };
    for (const l of locales) {
        languages[l] = `/${l}`;
    }
    return { canonical: `/${locale}`, languages };
}
