"use client";

// outsource dependencies
import { useRef, useState, useEffect } from "react";

// local dependencies
import { layoutCloud } from "./layoutCloud";
import { breakpoints } from "@/lib/breakpoints";

export type CloudState = "mobile" | "pending" | "measured" | "fallback";

const DESKTOP_QUERY = `(width >= ${breakpoints.tablet}px)`;

// Target fraction of the .body area that the cloud bounding box should fill.
const TARGET_FILL = 0.7;
// Never shrink the cloud below its natural size.
const MIN_SCALE = 1;
// Never grow the cloud more than 60% beyond its natural size.
const MAX_SCALE = 1.6;
// Skip the scaled pass when the computed scale is barely above 1.
const SCALE_THRESHOLD = 1.02;
// Base gap passed to layoutCloud at scale 1; scaled proportionally.
const BASE_GAP = 8;
// Base spiral spacing passed to layoutCloud at scale 1; scaled proportionally.
const BASE_SPACING = 6;

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

            // Step a: reset to natural size and measure.
            list.style.setProperty("--cloud-scale", "1");
            const boxes = items.map((el) => {
                const rect = el.getBoundingClientRect();
                return { width: rect.width, height: rect.height };
            });

            const first = layoutCloud(boxes, area);
            if (!mounted) return;

            // Step b: natural-size layout did not fit.
            if (!first.fits) {
                setState("fallback");
                return;
            }

            // Step c: bounding box of the step-a placements.
            let left = Infinity;
            let top = Infinity;
            let right = -Infinity;
            let bottom = -Infinity;
            for (let i = 0; i < boxes.length; i++) {
                const p = first.placements[i];
                const b = boxes[i];
                if (!p || !b) continue;
                if (p.x < left) left = p.x;
                if (p.y < top) top = p.y;
                if (p.x + b.width > right) right = p.x + b.width;
                if (p.y + b.height > bottom) bottom = p.y + b.height;
            }
            const bboxWidth = right - left;
            const bboxHeight = bottom - top;

            const rawScale = Math.min(
                (TARGET_FILL * area.width) / bboxWidth,
                (TARGET_FILL * area.height) / bboxHeight,
            );
            const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, rawScale));

            let placements = first.placements;

            // Step d: try the scaled pass if the gain is meaningful.
            if (scale > SCALE_THRESHOLD) {
                list.style.setProperty("--cloud-scale", String(scale));
                const scaledBoxes = items.map((el) => {
                    const rect = el.getBoundingClientRect();
                    return { width: rect.width, height: rect.height };
                });
                const second = layoutCloud(scaledBoxes, area, {
                    gap: BASE_GAP * scale,
                    spacing: BASE_SPACING * scale,
                });
                if (!mounted) return;
                if (second.fits) {
                    placements = second.placements;
                } else {
                    list.style.setProperty("--cloud-scale", "1");
                }
            }

            // Step e: apply the chosen placements.
            for (let i = 0; i < items.length; i++) {
                const el = items[i];
                const p = placements[i];
                if (el && p) {
                    el.style.setProperty("--x", `${p.x}px`);
                    el.style.setProperty("--y", `${p.y}px`);
                }
            }
            setState("measured");
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
