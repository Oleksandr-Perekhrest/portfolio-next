// outsource dependencies
import { useState } from "react";

export function useGallery(count: number) {
    const [index, setIndex] = useState(0);
    const canPrev = index > 0;
    const canNext = index < count - 1;
    const prev = () => setIndex((i) => Math.max(0, i - 1));
    const next = () => setIndex((i) => Math.min(count - 1, i + 1));
    return { index, canPrev, canNext, prev, next };
}
