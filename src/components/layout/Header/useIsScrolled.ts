// outsource dependencies
import { useState, useEffect } from "react";

export function useIsScrolled(threshold = 16): boolean {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const update = () => setIsScrolled(window.scrollY > threshold);

        update();

        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, [threshold]);

    return isScrolled;
}
