// outsource dependencies
import { jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";

if (typeof window !== "undefined") {
    // jsdom does not implement ResizeObserver; provide a minimal stub for Radix primitives
    class ResizeObserverStub {
        observe() {}
        unobserve() {}
        disconnect() {}
    }

    window.ResizeObserver = ResizeObserverStub;

    // jsdom does not implement IntersectionObserver; provide a minimal stub for useActiveSection
    class IntersectionObserverStub {
        observe() {}
        unobserve() {}
        disconnect() {}
    }

    window.IntersectionObserver =
        IntersectionObserverStub as unknown as typeof IntersectionObserver;

    // jsdom does not implement window.matchMedia; useCloudLayout reads it to pick
    // mobile vs. desktop layout. Default to no-match (mobile) so TechCloud renders
    // the plain flex list; tests that need the desktop branch still mock it locally.
    if (typeof window.matchMedia !== "function") {
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            configurable: true,
            value: () => ({
                matches: false,
                media: "",
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false,
            }),
        });
    }

    // jsdom does not implement document.fonts; useCloudLayout awaits fonts.ready
    // before measuring the cloud boxes.
    if (typeof document.fonts === "undefined") {
        Object.defineProperty(document, "fonts", {
            configurable: true,
            value: { ready: Promise.resolve() },
        });
    }
}

if (typeof window !== "undefined") {
    // window.location.assign is non-configurable in jsdom 26, so navigateTo is mocked
    // at the module level; tests assert against jest.mocked(navigateTo).
    jest.mock("@/lib/navigate", () => ({ navigateTo: jest.fn() }));

    // resend (via mailer.ts) pulls in postal-mime, which needs TextEncoder (not in jsdom).
    // The mock lives here, not in test files: jest.mock in a test file is not hoisted
    // above imports when jest comes from @jest/globals (next/jest SWC transform).
    jest.mock("@/lib/contact/actions", () => ({
        sendContactMessage: jest.fn(),
    }));
}

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
