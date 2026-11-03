// outsource dependencies
import { it, expect, describe } from "@jest/globals";

// local dependencies
import { techs, getCloud, type Tech, getTileSummary } from "./tech";

// Small fixture: 4 frontend (mixed levels, out of order), 3 backend, 2 shared.
// Literal expected values below are correct because this fixture never changes.
const FX: readonly Tech[] = [
    { name: "CSS", area: "frontend", level: 3 },
    { name: "TypeScript", area: "frontend", level: 2 },
    { name: "React", area: "frontend", level: 1 },
    { name: "Jest", area: "frontend", level: 4 },
    { name: "Docker", area: "backend", level: 3 },
    { name: "Node.js", area: "backend", level: 1 },
    { name: "Express", area: "backend", level: 2 },
    { name: "Git", area: "shared" },
    { name: "Cursor", area: "shared" },
];

describe("getTileSummary — fixture", () => {
    it("frontend: sorts by level, returns top-N names", () => {
        const r = getTileSummary("frontend", 2, FX);
        expect(r.names).toEqual(["React", "TypeScript"]);
        expect(r.restCount).toBe(4); // (4 area - 2 limit) + 2 shared
    });

    it("frontend: limit larger than area size → all names, restCount = shared only", () => {
        const r = getTileSummary("frontend", 10, FX);
        expect(r.names).toEqual(["React", "TypeScript", "CSS", "Jest"]);
        expect(r.restCount).toBe(2); // max(0, 4-10) + 2 shared
    });

    it("backend: sorts by level, returns top-N names", () => {
        const r = getTileSummary("backend", 2, FX);
        expect(r.names).toEqual(["Node.js", "Express"]);
        expect(r.restCount).toBe(3); // (3 area - 2 limit) + 2 shared
    });
});

describe("getCloud — fixture", () => {
    it("frontend: area items sorted by level, shared appended at the end", () => {
        const names = getCloud("frontend", FX).map((t) => t.name);
        expect(names).toEqual([
            "React",
            "TypeScript",
            "CSS",
            "Jest",
            "Git",
            "Cursor",
        ]);
    });

    it("backend: area items sorted by level, shared appended at the end", () => {
        const names = getCloud("backend", FX).map((t) => t.name);
        expect(names).toEqual([
            "Node.js",
            "Express",
            "Docker",
            "Git",
            "Cursor",
        ]);
    });

    it("backend cloud: no frontend items", () => {
        expect(
            getCloud("backend", FX).every((t) => t.area !== "frontend"),
        ).toBe(true);
    });

    it("frontend cloud: no backend items", () => {
        expect(
            getCloud("frontend", FX).every((t) => t.area !== "backend"),
        ).toBe(true);
    });
});

describe("techs — invariants", () => {
    it("tech names are unique", () => {
        const names = Array.from(techs).map((t) => t.name);
        expect(new Set(names).size).toBe(names.length);
    });

    it("every level 1–2 frontend/backend item has an icon", () => {
        const lowLevel = Array.from(techs).filter(
            (t) => t.area !== "shared" && t.level <= 2,
        );
        expect(lowLevel.length).toBeGreaterThan(0); // control: list is non-empty
        for (const item of lowLevel) {
            if (item.area !== "shared") expect(item.icon).toBeDefined();
        }
    });

    it("level 3–4 and shared items have no icon", () => {
        for (const t of techs) {
            if (t.area === "shared") {
                expect("icon" in t).toBe(false);
            } else if (t.level >= 3) {
                expect(t.icon).toBeUndefined();
            }
        }
    });

    it("at least one level-1 item in each area", () => {
        const frontendL1 = Array.from(techs).filter(
            (t) => t.area === "frontend" && t.level === 1,
        );
        const backendL1 = Array.from(techs).filter(
            (t) => t.area === "backend" && t.level === 1,
        );
        expect(frontendL1.length).toBeGreaterThan(0);
        expect(backendL1.length).toBeGreaterThan(0);
    });
});
