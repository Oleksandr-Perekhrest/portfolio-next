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
});
