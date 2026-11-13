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

// @/content/projects is mocked here so ProjectGallery tests can control the
// data per test via globalThis.__setMockProjects without re-requiring the module.
// The getter is lazy: changing the override before a render is enough.
let _projectsOverride: readonly unknown[] | undefined;

(
    globalThis as unknown as {
        __setMockProjects(d: readonly unknown[] | undefined): void;
    }
).__setMockProjects = (d) => {
    _projectsOverride = d;
};

jest.mock("@/content/projects", () => {
    const actual = jest.requireActual(
        "@/content/projects",
    ) as typeof import("@/content/projects");
    return {
        get projects() {
            return _projectsOverride ?? actual.projects;
        },
    };
});

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
