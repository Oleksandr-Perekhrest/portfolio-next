"use client";

// outsource dependencies
import { useRef, useState, useEffect } from "react";

// local dependencies
import { layoutCloud } from "./layoutCloud";
import { breakpoints } from "@/lib/breakpoints";

export type CloudState = "mobile" | "pending" | "measured" | "fallback";

const DESKTOP_QUERY = `(width >= ${breakpoints.tablet}px)`;

function readInitialState(): CloudState {
    if (typeof window === "undefined") return "pending";
    return window.matchMedia(DESKTOP_QUERY).matches ? "pending" : "mobile";
}

export function useCloudLayout() {
    const bodyRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [state, setState] = useState<CloudState>(readInitialState);

    useEffect(() => {
        let mounted = true;
        let frameId: number | null = null;
        let observer: ResizeObserver | null = null;
        let generation = 0;

        const mql = window.matchMedia(DESKTOP_QUERY);

        const measure = () => {
            const body = bodyRef.current;
            const list = listRef.current;
            if (!body || !list) return;

            const area = {
                width: body.clientWidth,
                height: body.clientHeight,
            };

            const items: HTMLLIElement[] = [];
            for (const child of list.children) {
                if (child instanceof HTMLLIElement) items.push(child);
            }

            const boxes = items.map((el) => {
                const rect = el.getBoundingClientRect();
                return { width: rect.width, height: rect.height };
            });

            const result = layoutCloud(boxes, area);
            if (!mounted) return;

            if (result.fits) {
                for (let i = 0; i < items.length; i++) {
                    const el = items[i];
                    const p = result.placements[i];
                    if (el && p) {
                        el.style.setProperty("--x", `${p.x}px`);
                        el.style.setProperty("--y", `${p.y}px`);
                    }
                }
                setState("measured");
            } else {
                setState("fallback");
            }
        };

        const schedule = () => {
            if (frameId !== null) return;
            frameId = requestAnimationFrame(() => {
                frameId = null;
                if (!mounted || !mql.matches) return;
                measure();
            });
        };

        const teardown = () => {
            if (observer) {
                observer.disconnect();
                observer = null;
            }
            if (frameId !== null) {
                cancelAnimationFrame(frameId);
                frameId = null;
            }
        };

        const setupDesktop = () => {
            const gen = ++generation;
            void document.fonts.ready.then(() => {
                if (!mounted || gen !== generation) return;
                if (!mql.matches) return;
                measure();
                const body = bodyRef.current;
                if (!body) return;
                observer = new ResizeObserver(schedule);
                observer.observe(body);
            });
        };

        const onMediaChange = () => {
            generation++;
            teardown();
            if (mql.matches) {
                setState("pending");
                setupDesktop();
            } else {
                setState("mobile");
            }
        };

        if (mql.matches) {
            setupDesktop();
        }

        mql.addEventListener("change", onMediaChange);

        return () => {
            mounted = false;
            mql.removeEventListener("change", onMediaChange);
            teardown();
        };
    }, []);

    return { bodyRef, listRef, state };
}
