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

/** Zips placements with their boxes; throws if a box is missing for a placement. */
function pairs(
    placements: readonly CloudPlacement[],
    boxes: readonly CloudBox[],
): [CloudPlacement, CloudBox][] {
    return placements.map((p, i) => {
        const b = boxes[i];
        if (!b) throw new Error(`no box for placement ${i}`);
        return [p, b];
    });
}

function fail(index: number): never {
    throw new Error(`missing pair at index ${index}`);
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

function makeBoxes(count: number): CloudBox[] {
    return Array.from({ length: count }, (_, i) => ({
        width: 40 + (i % 7) * 20,
        height: 20 + (i % 3) * 8,
    }));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("layoutCloud — first box centered", () => {
    it("centers a 100×40 box exactly in an 800×600 area", () => {
        const area = { width: 800, height: 600 };
        const box: CloudBox = { width: 100, height: 40 };
        const { placements } = layoutCloud([box], area);
        expect(placements[0]).toEqual({
            x: (800 - 100) / 2,
            y: (600 - 40) / 2,
        });
    });
});

describe("layoutCloud — 40 mixed-size boxes in 1200×700", () => {
    const area = { width: 1200, height: 700 };
    const GAP = 8;
    const boxes = makeBoxes(40);
    const result = layoutCloud(boxes, area, { gap: GAP });

    it("fits is true", () => {
        expect(result.fits).toBe(true);
    });

    it("placements.length equals boxes.length", () => {
        expect(result.placements.length).toBe(boxes.length);
    });

    it("every box lies fully inside the area", () => {
        for (const [p, b] of pairs(result.placements, boxes)) {
            expect(p.x).toBeGreaterThanOrEqual(0);
            expect(p.y).toBeGreaterThanOrEqual(0);
            expect(p.x + b.width).toBeLessThanOrEqual(area.width);
            expect(p.y + b.height).toBeLessThanOrEqual(area.height);
        }
    });

    it("no two boxes overlap when each is enlarged by the gap", () => {
        const placed = pairs(result.placements, boxes);
        for (let i = 0; i < placed.length; i++) {
            for (let j = i + 1; j < placed.length; j++) {
                const [pi, bi] = placed[i] ?? fail(i);
                const [pj, bj] = placed[j] ?? fail(j);
                expect(gapOverlaps(pi.x, pi.y, bi, pj.x, pj.y, bj, GAP)).toBe(
                    false,
                );
            }
        }
    });
});

describe("layoutCloud — gap controls spacing", () => {
    it("gap 8 and gap 30 produce different placements", () => {
        const area = { width: 1200, height: 700 };
        const boxes = makeBoxes(10);

        const { placements: p8 } = layoutCloud(boxes, area, { gap: 8 });
        const { placements: p30 } = layoutCloud(boxes, area, { gap: 30 });

        // The first box is always centered; at least one other placement must differ.
        const differs = p8.some(
            (p, i) => p.x !== p30[i]?.x || p.y !== p30[i]?.y,
        );
        expect(differs).toBe(true);
    });
});

describe("layoutCloud — determinism", () => {
    it("two calls with identical input return deep-equal results", () => {
        const area = { width: 1200, height: 700 };
        const boxes = makeBoxes(40);

        const first = layoutCloud(boxes, area);
        const second = layoutCloud(boxes, area);

        expect(first).toEqual(second);
    });
});

describe("layoutCloud — area too small", () => {
    const area = { width: 60, height: 60 };
    const boxes: CloudBox[] = Array.from({ length: 10 }, () => ({
        width: 50,
        height: 30,
    }));
    const result = layoutCloud(boxes, area);

    it("fits is false when the area is too small for the boxes", () => {
        expect(result.fits).toBe(false);
    });

    it("placements contains only the boxes placed before the failure", () => {
        expect(result.placements.length).toBeGreaterThan(0);
        expect(result.placements.length).toBeLessThan(boxes.length);
    });
});

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
