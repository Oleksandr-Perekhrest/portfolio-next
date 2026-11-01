// outsource dependencies
import { useRef, useState, useEffect } from "react";

export function useActiveSection(ids: readonly string[]): string | null {
    const [activeId, setActiveId] = useState<string | null>(null);
    const intersecting = useRef<Set<string>>(new Set());

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        intersecting.current.add(entry.target.id);
                    } else {
                        intersecting.current.delete(entry.target.id);
                    }
                });
                const active =
                    ids.find((id) => intersecting.current.has(id)) ?? null;
                setActiveId(active);
            },
            { rootMargin: "-45% 0px -50% 0px" },
        );

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 2
            ) {
                setActiveId(ids[ids.length - 1] ?? null);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
        };
    }, [ids]);

    return activeId;
}
