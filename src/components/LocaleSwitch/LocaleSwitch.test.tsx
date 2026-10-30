// outsource dependencies
import { screen, cleanup, fireEvent } from "@testing-library/react";
import {
    it,
    jest,
    expect,
    describe,
    afterEach,
    beforeEach,
} from "@jest/globals";

// local dependencies
import LocaleSwitch from "./LocaleSwitch";
import * as NavigateModule from "@/lib/navigate";
import { renderWithIntl } from "@/test/renderWithIntl";

// @/i18n/navigation is mocked globally in jest.setup.ts (usePathname and getPathname
// are not available in jsdom; Link was replaced by plain <a> to fix theme reset on navigation).
// @/lib/navigate is also mocked globally in jest.setup.ts (window.location.assign is
// non-configurable in jsdom 26 so the wrapper module is mocked instead).

describe("LocaleSwitch", () => {
    afterEach(cleanup);

    describe("en locale", () => {
        it("renders uk link first, en link second, with correct hrefs and hrefLang", () => {
            const { container } = renderWithIntl(<LocaleSwitch />, {
                locale: "en",
            });
            const links = container.querySelectorAll("a[hrefLang]");

            expect(links).toHaveLength(2);
            expect(links[0]).toHaveAttribute("hrefLang", "uk");
            expect(links[0]).toHaveAttribute("href", "/uk");
            expect(links[1]).toHaveAttribute("hrefLang", "en");
            expect(links[1]).toHaveAttribute("href", "/en");
        });

        it("sets aria-current on the en link only", () => {
            renderWithIntl(<LocaleSwitch />, { locale: "en" });

            expect(
                screen.getByRole("link", { name: "English" }),
            ).toHaveAttribute("aria-current", "true");
            expect(
                screen.getByRole("link", { name: "Українська" }),
            ).not.toHaveAttribute("aria-current");
        });

        it("track exposes data-locale='en' for CSS indicator positioning", () => {
            const { container } = renderWithIntl(<LocaleSwitch />, {
                locale: "en",
            });
            const track = container.querySelector("[data-locale]");

            expect(track).toHaveAttribute("data-locale", "en");
        });
    });

    describe("uk locale", () => {
        it("renders uk link first, en link second, with correct hrefs and hrefLang", () => {
            const { container } = renderWithIntl(<LocaleSwitch />, {
                locale: "uk",
            });
            const links = container.querySelectorAll("a[hrefLang]");

            expect(links).toHaveLength(2);
            expect(links[0]).toHaveAttribute("hrefLang", "uk");
            expect(links[0]).toHaveAttribute("href", "/uk");
            expect(links[1]).toHaveAttribute("hrefLang", "en");
            expect(links[1]).toHaveAttribute("href", "/en");
        });

        it("sets aria-current on the uk link only", () => {
            renderWithIntl(<LocaleSwitch />, { locale: "uk" });

            expect(
                screen.getByRole("link", { name: "Українська" }),
            ).toHaveAttribute("aria-current", "true");
            expect(
                screen.getByRole("link", { name: "English" }),
            ).not.toHaveAttribute("aria-current");
        });

        it("track exposes data-locale='uk' for CSS indicator and flag easter egg", () => {
            const { container } = renderWithIntl(<LocaleSwitch />, {
                locale: "uk",
            });
            const track = container.querySelector("[data-locale]");

            expect(track).toHaveAttribute("data-locale", "uk");
        });
    });

    describe("click interaction", () => {
        // navigateTo is mocked globally in jest.setup.ts; access via jest.mocked
        const navigateSpy = () => jest.mocked(NavigateModule.navigateTo);

        function mockMatchMedia(prefersReducedMotion: boolean) {
            Object.defineProperty(window, "matchMedia", {
                configurable: true,
                writable: true,
                value: jest.fn().mockReturnValue({
                    matches: prefersReducedMotion,
                    media: "",
                    onchange: null,
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                    dispatchEvent: jest.fn(),
                }),
            });
        }

        beforeEach(() => {
            jest.useFakeTimers();
            jest.clearAllMocks();
            mockMatchMedia(false);
        });

        afterEach(() => {
            jest.runAllTimers();
            jest.useRealTimers();
            cleanup();
        });

        it("clicking the inactive link moves the indicator then navigates after 150 ms", () => {
            const { container } = renderWithIntl(<LocaleSwitch />, {
                locale: "en",
            });
            const track = container.querySelector("[data-locale]");

            expect(track).toHaveAttribute("data-locale", "en");

            fireEvent.click(screen.getByRole("link", { name: "Українська" }), {
                button: 0,
            });

            expect(track).toHaveAttribute("data-locale", "uk");
            expect(navigateSpy()).not.toHaveBeenCalled();

            jest.advanceTimersByTime(150);

            expect(navigateSpy()).toHaveBeenCalledWith("/uk");
        });

        it("ctrl-click on the inactive link does not intercept navigation", () => {
            renderWithIntl(<LocaleSwitch />, { locale: "en" });

            fireEvent.click(screen.getByRole("link", { name: "Українська" }), {
                button: 0,
                ctrlKey: true,
            });

            jest.advanceTimersByTime(300);

            expect(navigateSpy()).not.toHaveBeenCalled();
        });

        it("meta-click (Cmd) on the inactive link does not intercept navigation", () => {
            renderWithIntl(<LocaleSwitch />, { locale: "en" });

            fireEvent.click(screen.getByRole("link", { name: "Українська" }), {
                button: 0,
                metaKey: true,
            });

            jest.advanceTimersByTime(300);

            expect(navigateSpy()).not.toHaveBeenCalled();
        });

        it("under prefers-reduced-motion the click is not intercepted — browser handles navigation", () => {
            mockMatchMedia(true);
            const { container } = renderWithIntl(<LocaleSwitch />, {
                locale: "en",
            });
            const track = container.querySelector("[data-locale]");

            fireEvent.click(screen.getByRole("link", { name: "Українська" }), {
                button: 0,
            });

            // Indicator must not move — we did not intercept the click
            expect(track).toHaveAttribute("data-locale", "en");

            jest.advanceTimersByTime(300);

            expect(navigateSpy()).not.toHaveBeenCalled();
        });
    });
});
