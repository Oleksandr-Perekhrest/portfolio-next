// outsource dependencies
import { it, expect, describe } from "@jest/globals";

// local dependencies
import {
    layoutCloud,
    spiralRadius,
    type CloudBox,
    type CloudPlacement,
} from "./layoutCloud";

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true when box A (expanded by gap on all sides) overlaps box B
 * (not expanded). Mirrors the overlap predicate in noOverlap() so the test
 * verifies the invariant the algorithm actually maintains.
 *
 * The check is symmetric: gapOverlaps(a, b, gap) === gapOverlaps(b, a, gap).
 */
function gapOverlaps(
    ax: number,
    ay: number,
    aBox: CloudBox,
    bx: number,
    by: number,
    bBox: CloudBox,
    gap: number,
): boolean {
    return (
        ax - gap < bx + bBox.width &&
        ax + aBox.width + gap > bx &&
        ay - gap < by + bBox.height &&
        ay + aBox.height + gap > by
    );
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

function makeBoxes(count: number): CloudBox[] {
    return Array.from({ length: count }, (_, i) => ({
        width: 40 + (i % 7) * 20,
        height: 20 + (i % 3) * 8,
    }));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("spiralRadius", () => {
    // Regression guard: the radius growth per turn must not depend on the
    // angular step. When it did, the spiral grew 0.2 px per turn and layout
    // was ~12× slower. Timing in Jest is not reliable, so the formula is
    // checked directly.
    it("grows by exactly `spacing` px per full turn", () => {
        expect(spiralRadius(2 * Math.PI, 6)).toBeCloseTo(6);
        expect(spiralRadius(4 * Math.PI, 6)).toBeCloseTo(12);
    });

    it("scales with spacing", () => {
        expect(spiralRadius(2 * Math.PI, 9)).toBeCloseTo(9);
    });
});
