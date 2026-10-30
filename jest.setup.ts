// outsource dependencies
import { jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";

// jsdom does not implement ResizeObserver; provide a minimal stub for Radix primitives
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserverStub;

// window.location.assign is non-configurable in jsdom 26, so navigateTo is mocked
// at the module level; tests assert against jest.mocked(navigateTo).
jest.mock("@/lib/navigate", () => ({ navigateTo: jest.fn() }));

// LocaleSwitch uses usePathname and getPathname (both unavailable in jsdom).
// not-found.tsx still uses Link. All three are mocked here:
//   - usePathname: returns "/" (single static root page).
//   - getPathname: builds the locale-prefixed URL the same way next-intl does.
//   - Link: renders a plain <a> so next-found tests can assert on the link role.
jest.mock("@/i18n/navigation", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createElement } = require("react") as typeof import("react");
    return {
        usePathname: () => "/",
        getPathname: ({
            href,
            locale,
        }: {
            href: string;
            locale: string;
        }): string => `/${locale}${href === "/" ? "" : href}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Link: (props: any) => {
            const { children, href, ...rest } = props as {
                children: import("react").ReactNode;
                href: string;
                [key: string]: unknown;
            };
            return createElement("a", { ...rest, href }, children);
        },
    };
});
