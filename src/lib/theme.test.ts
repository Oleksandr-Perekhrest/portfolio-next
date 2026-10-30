// outsource dependencies
import {
    it,
    jest,
    expect,
    describe,
    afterEach,
    beforeEach,
} from "@jest/globals";

// local dependencies
import { setTheme, themeScript, THEME_STORAGE_KEY } from "@/lib/theme";

function runScript() {
    new Function(themeScript)();
}

function mockMatchMedia(prefersDark: boolean) {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: (query: string) => ({
            matches: query.includes("dark") ? prefersDark : false,
        }),
    });
}

describe("themeScript", () => {
    beforeEach(() => {
        localStorage.clear();
        delete document.documentElement.dataset.theme;
    });

    afterEach(() => {
        localStorage.clear();
        delete document.documentElement.dataset.theme;
    });

    it("stored 'dark' → sets dark theme", () => {
        localStorage.setItem(THEME_STORAGE_KEY, "dark");
        mockMatchMedia(false);
        runScript();
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    it("stored 'light' with system dark → sets light theme", () => {
        localStorage.setItem(THEME_STORAGE_KEY, "light");
        mockMatchMedia(true);
        runScript();
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    it("nothing stored + system dark → dark", () => {
        mockMatchMedia(true);
        runScript();
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    it("nothing stored + system light → light", () => {
        mockMatchMedia(false);
        runScript();
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    it("invalid stored value → system theme", () => {
        localStorage.setItem(THEME_STORAGE_KEY, "invalid");
        mockMatchMedia(true);
        runScript();
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    it("localStorage.getItem throws → falls back to system theme, no error", () => {
        const spy = jest
            .spyOn(Storage.prototype, "getItem")
            .mockImplementationOnce(() => {
                throw new Error("storage error");
            });
        mockMatchMedia(true);
        expect(() => runScript()).not.toThrow();
        expect(document.documentElement.dataset.theme).toBe("dark");
        spy.mockRestore();
    });
});

describe("setTheme", () => {
    afterEach(() => {
        localStorage.clear();
        delete document.documentElement.dataset.theme;
    });

    it("sets data-theme on <html> and saves to localStorage", () => {
        setTheme("dark");
        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    });

    it("does not throw and still sets data-theme when localStorage.setItem throws", () => {
        const spy = jest
            .spyOn(Storage.prototype, "setItem")
            .mockImplementationOnce(() => {
                throw new Error("storage error");
            });
        expect(() => setTheme("dark")).not.toThrow();
        expect(document.documentElement.dataset.theme).toBe("dark");
        spy.mockRestore();
    });

    it("setTheme('light') updates both", () => {
        setTheme("light");
        expect(document.documentElement.dataset.theme).toBe("light");
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    });
});
