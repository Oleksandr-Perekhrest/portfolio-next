export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export const themeScript = `(function () {
    var theme;
    try {
        var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
        if (stored === "light" || stored === "dark") {
            theme = stored;
        }
    } catch (_) {}
    if (!theme) {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }
    document.documentElement.dataset.theme = theme;
})();`;

export function setTheme(theme: Theme): void {
    document.documentElement.dataset.theme = theme;
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
}
