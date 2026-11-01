// outsource dependencies
import { it, expect, describe } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

// local dependencies
import { useGallery } from "./useGallery";

describe("useGallery", () => {
    it("starts at index 0 with canPrev false", () => {
        const { result } = renderHook(() => useGallery(3));
        expect(result.current.index).toBe(0);
        expect(result.current.canPrev).toBe(false);
    });

    it("next() moves the index forward", () => {
        const { result } = renderHook(() => useGallery(3));
        act(() => result.current.next());
        expect(result.current.index).toBe(1);
        expect(result.current.canPrev).toBe(true);
    });

    it("index never exceeds count - 1", () => {
        const { result } = renderHook(() => useGallery(3));
        act(() => result.current.next());
        act(() => result.current.next());
        act(() => result.current.next());
        expect(result.current.index).toBe(2);
        expect(result.current.canNext).toBe(false);
    });

    it("index never goes below 0", () => {
        const { result } = renderHook(() => useGallery(3));
        act(() => result.current.prev());
        expect(result.current.index).toBe(0);
    });

    it("count 1 → canPrev and canNext both false", () => {
        const { result } = renderHook(() => useGallery(1));
        expect(result.current.canPrev).toBe(false);
        expect(result.current.canNext).toBe(false);
    });
});
