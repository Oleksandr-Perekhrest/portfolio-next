// outsource dependencies
import { useRef, useState, useEffect } from "react";

const SCROLL_KEYS = new Set([
    "ArrowUp",
    "ArrowDown",
    "PageUp",
    "PageDown",
    "Home",
    "End",
    " ",
]);

export function useActiveSection(ids: readonly string[]): string | null {
    const [activeId, setActiveId] = useState<string | null>(null);
    const intersecting = useRef<Set<string>>(new Set());
    const pinnedId = useRef<string | null>(null);

    useEffect(() => {
        function computeActive(): string | null {
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 2
            ) {
                return ids[ids.length - 1] ?? null;
            }
            return ids.find((id) => intersecting.current.has(id)) ?? null;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        intersecting.current.add(entry.target.id);
                    } else {
                        intersecting.current.delete(entry.target.id);
                    }
                });
                if (pinnedId.current !== null) return;
                setActiveId(computeActive());
            },
            { rootMargin: "-45% 0px -50% 0px" },
        );

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        const clearPin = () => {
            if (pinnedId.current === null) return;
            pinnedId.current = null;
            setActiveId(computeActive());
        };

        const handleClick = (e: MouseEvent) => {
            if (e.button !== 0) return;
            if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
            const anchor = (e.target as Element).closest("a[href]");
            if (!anchor) return;
            const href = anchor.getAttribute("href") ?? "";
            if (!href.startsWith("#")) return;
            const hash = href.slice(1);
            if ((ids as readonly string[]).includes(hash)) {
                pinnedId.current = hash;
                setActiveId(hash);
            } else {
                pinnedId.current = null;
                setActiveId(null);
            }
        };

        const handleScroll = () => {
            if (pinnedId.current !== null) return;
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 2
            ) {
                setActiveId(ids[ids.length - 1] ?? null);
            }
        };

        const handleWheel = () => clearPin();
        const handleTouchmove = () => clearPin();

        const handleKeydown = (e: KeyboardEvent) => {
            if (!SCROLL_KEYS.has(e.key)) return;
            const target = e.target as Element;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                (target as HTMLElement).isContentEditable
            )
                return;
            clearPin();
        };

        document.addEventListener("click", handleClick, true);
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("wheel", handleWheel, { passive: true });
        window.addEventListener("touchmove", handleTouchmove, {
            passive: true,
        });
        window.addEventListener("keydown", handleKeydown);

        return () => {
            observer.disconnect();
            document.removeEventListener("click", handleClick, true);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchmove", handleTouchmove);
            window.removeEventListener("keydown", handleKeydown);
        };
    }, [ids]);

    return activeId;
}
