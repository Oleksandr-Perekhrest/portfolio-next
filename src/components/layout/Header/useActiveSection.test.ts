// outsource dependencies
import { act, renderHook } from "@testing-library/react";
import {
    it,
    jest,
    expect,
    describe,
    afterEach,
    beforeEach,
} from "@jest/globals";

// local dependencies
import { useActiveSection } from "./useActiveSection";

type IOCallback = IntersectionObserverCallback;

const IDS = ["experience", "about", "contact"] as const;

// Saved at module scope so afterEach can restore the jest.setup.ts stub
const savedIO = window.IntersectionObserver;

let capturedCallback: IOCallback | null = null;
let capturedObserved: Element[] = [];
let disconnectMock: ReturnType<typeof jest.fn>;

function triggerIntersection(el: Element, isIntersecting: boolean) {
    capturedCallback!(
        [
            { isIntersecting, target: el },
        ] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
    );
}

describe("useActiveSection", () => {
    let experience: HTMLElement;
    let about: HTMLElement;
    let contact: HTMLElement;

    beforeEach(() => {
        capturedCallback = null;
        capturedObserved = [];
        disconnectMock = jest.fn();

        window.IntersectionObserver = jest.fn().mockImplementation((cb) => {
            capturedCallback = cb as IOCallback;
            return {
                observe: jest.fn((el: Element) => capturedObserved.push(el)),
                unobserve: jest.fn(),
                disconnect: disconnectMock,
            };
        }) as unknown as typeof IntersectionObserver;

        // Make scrollHeight large so the bottom rule is NOT met by default
        Object.defineProperty(document.documentElement, "scrollHeight", {
            get: () => 10000,
            configurable: true,
        });
        Object.defineProperty(window, "scrollY", {
            value: 0,
            configurable: true,
            writable: true,
        });

        experience = document.createElement("section");
        experience.id = "experience";
        about = document.createElement("section");
        about.id = "about";
        contact = document.createElement("section");
        contact.id = "contact";
        document.body.append(experience, about, contact);
    });

    afterEach(() => {
        experience.remove();
        about.remove();
        contact.remove();
        window.IntersectionObserver = savedIO;
        // Remove own-property override so jsdom's prototype getter takes over again
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (document.documentElement as any).scrollHeight;
        Object.defineProperty(window, "scrollY", {
            value: 0,
            configurable: true,
            writable: true,
        });
    });

    it("returns null initially", () => {
        const { result } = renderHook(() => useActiveSection(IDS));
        expect(result.current).toBeNull();
    });

    it("returns the intersecting section id", () => {
        const { result } = renderHook(() => useActiveSection(IDS));
        act(() => triggerIntersection(about, true));
        expect(result.current).toBe("about");
    });

    it("returns null when the section stops intersecting", () => {
        const { result } = renderHook(() => useActiveSection(IDS));
        act(() => triggerIntersection(about, true));
        act(() => triggerIntersection(about, false));
        expect(result.current).toBeNull();
    });

    describe("bottom rule and pin", () => {
        let anchorAbout: HTMLAnchorElement;
        let anchorTop: HTMLAnchorElement;

        beforeEach(() => {
            // Activate bottom rule: window.innerHeight + scrollY >= scrollHeight - 2
            Object.defineProperty(window, "scrollY", {
                value: 1000,
                configurable: true,
                writable: true,
            });
            Object.defineProperty(document.documentElement, "scrollHeight", {
                get: () => 1000,
                configurable: true,
            });

            anchorAbout = document.createElement("a");
            anchorAbout.setAttribute("href", "#about");
            anchorTop = document.createElement("a");
            anchorTop.setAttribute("href", "#top");
            document.body.append(anchorAbout, anchorTop);
        });

        afterEach(() => {
            anchorAbout.remove();
            anchorTop.remove();
        });

        it("dispatching scroll activates the last section when at the bottom", () => {
            const { result } = renderHook(() => useActiveSection(IDS));
            expect(result.current).toBeNull();
            act(() => {
                window.dispatchEvent(new Event("scroll"));
            });
            expect(result.current).toBe("contact");
        });

        it("clicking #about pins the active section and a plain scroll keeps it", () => {
            const { result } = renderHook(() => useActiveSection(IDS));
            act(() => {
                window.dispatchEvent(new Event("scroll"));
            });
            expect(result.current).toBe("contact");
            act(() => {
                anchorAbout.dispatchEvent(
                    new MouseEvent("click", {
                        bubbles: true,
                        cancelable: true,
                        button: 0,
                    }),
                );
            });
            expect(result.current).toBe("about");
            act(() => {
                window.dispatchEvent(new Event("scroll"));
            });
            expect(result.current).toBe("about");
        });

        it("wheel event clears the pin and restores the bottom-rule active section", () => {
            const { result } = renderHook(() => useActiveSection(IDS));
            act(() => {
                window.dispatchEvent(new Event("scroll"));
            });
            act(() => {
                anchorAbout.dispatchEvent(
                    new MouseEvent("click", {
                        bubbles: true,
                        cancelable: true,
                        button: 0,
                    }),
                );
            });
            expect(result.current).toBe("about");
            act(() => {
                window.dispatchEvent(new Event("wheel"));
            });
            expect(result.current).toBe("contact");
        });

        it("clicking #top sets active to null", () => {
            const { result } = renderHook(() => useActiveSection(IDS));
            act(() => {
                window.dispatchEvent(new Event("scroll"));
            });
            expect(result.current).toBe("contact");
            act(() => {
                anchorTop.dispatchEvent(
                    new MouseEvent("click", {
                        bubbles: true,
                        cancelable: true,
                        button: 0,
                    }),
                );
            });
            expect(result.current).toBeNull();
        });

        it("ctrl-click on #about is ignored and active section is unchanged", () => {
            const { result } = renderHook(() => useActiveSection(IDS));
            act(() => {
                window.dispatchEvent(new Event("scroll"));
            });
            expect(result.current).toBe("contact");
            act(() => {
                anchorAbout.dispatchEvent(
                    new MouseEvent("click", {
                        bubbles: true,
                        cancelable: true,
                        button: 0,
                        ctrlKey: true,
                    }),
                );
            });
            expect(result.current).toBe("contact");
        });
    });

    it("unmount disconnects the observer and removes all window/document listeners", () => {
        const winRemoveSpy = jest.spyOn(window, "removeEventListener");
        const docRemoveSpy = jest.spyOn(document, "removeEventListener");

        const { unmount } = renderHook(() => useActiveSection(IDS));
        act(() => unmount());

        expect(disconnectMock).toHaveBeenCalledTimes(1);

        const winEvents = winRemoveSpy.mock.calls.map((c) => c[0]);
        expect(winEvents).toContain("scroll");
        expect(winEvents).toContain("wheel");
        expect(winEvents).toContain("touchmove");
        expect(winEvents).toContain("keydown");

        const docEvents = docRemoveSpy.mock.calls.map((c) => c[0]);
        expect(docEvents).toContain("click");

        winRemoveSpy.mockRestore();
        docRemoveSpy.mockRestore();
    });
});
