// outsource dependencies
import { it, expect, describe } from "@jest/globals";

// local dependencies
import { techs, getCloud, getTileSummary } from "./tech";

describe("getTileSummary", () => {
    it("frontend: first 5 by level, restCount = 13 area + 3 shared", () => {
        const result = getTileSummary("frontend");
        expect(result.names).toEqual([
            "React",
            "Next.js",
            "TypeScript",
            "Redux",
            "React Native",
        ]);
        expect(result.restCount).toBe(16);
    });

    it("backend: first 5 by level, restCount = 8 area + 3 shared", () => {
        const result = getTileSummary("backend");
        expect(result.names).toEqual([
            "Node.js",
            "Express",
            "Prisma",
            "PostgreSQL",
            "Docker",
        ]);
        expect(result.restCount).toBe(11);
    });

    it("backend with limit 50: all 13 names returned, restCount = 3 (shared only)", () => {
        const result = getTileSummary("backend", 50);
        expect(result.names).toEqual([
            "Node.js",
            "Express",
            "Prisma",
            "PostgreSQL",
            "Docker",
            "REST API",
            "zod",
            "Vitest",
            "Supertest",
            "GitHub Actions",
            "Google OAuth",
            "Vercel",
            "Render",
        ]);
        expect(result.restCount).toBe(3);
    });
});

describe("getCloud", () => {
    it("backend cloud contains Git (shared item)", () => {
        const cloud = getCloud("backend");
        expect(cloud.map((t) => t.name)).toContain("Git");
    });

    it("backend cloud contains no frontend items", () => {
        const cloud = getCloud("backend");
        expect(cloud.every((t) => t.area !== "frontend")).toBe(true);
    });

    it("tech names are unique", () => {
        const allNames = Array.from(techs).map((t) => t.name);
        expect(new Set(allNames).size).toBe(allNames.length);
    });

    it("frontend cloud: first item is React", () => {
        const cloud = getCloud("frontend");
        expect(cloud[0]?.name).toBe("React");
    });

    it("frontend cloud: area item levels are non-decreasing", () => {
        const cloud = getCloud("frontend");
        const areaItems = cloud.filter((t) => t.area !== "shared");
        for (let i = 1; i < areaItems.length; i++) {
            const prev = areaItems[i - 1]!;
            const curr = areaItems[i]!;
            expect((curr as { level: number }).level).toBeGreaterThanOrEqual(
                (prev as { level: number }).level,
            );
        }
    });

    it("frontend cloud: last three items are Git, Claude Code, Cursor", () => {
        const cloud = getCloud("frontend");
        expect(cloud.slice(-3).map((t) => t.name)).toEqual([
            "Git",
            "Claude Code",
            "Cursor",
        ]);
    });

    it("frontend cloud: length is 18 + 3 = 21", () => {
        const cloud = getCloud("frontend");
        expect(cloud).toHaveLength(21);
    });
});

describe("icon coverage", () => {
    it("every frontend/backend item with level 1–2 has an icon", () => {
        const lowLevel = Array.from(techs).filter((t) => {
            if (t.area === "shared") return false;
            return t.level <= 2;
        });
        expect(lowLevel.length).toBeGreaterThan(0);
        for (const item of lowLevel) {
            if (item.area !== "shared") {
                expect(item.icon).toBeDefined();
            }
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
});
