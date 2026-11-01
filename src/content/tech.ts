type FrontendTech = { name: string; area: "frontend"; level: 1 | 2 | 3 | 4 };
type BackendTech = { name: string; area: "backend"; level: 1 | 2 | 3 | 4 };
type SharedTech = { name: string; area: "shared" };
export type Tech = FrontendTech | BackendTech | SharedTech;

export const techs: readonly Tech[] = [
    { name: "React", area: "frontend", level: 1 },
    { name: "Next.js", area: "frontend", level: 2 },
    { name: "TypeScript", area: "frontend", level: 2 },
    { name: "Redux", area: "frontend", level: 2 },
    { name: "React Native", area: "frontend", level: 2 },
    { name: "JavaScript", area: "frontend", level: 2 },
    { name: "SCSS", area: "frontend", level: 3 },
    { name: "CSS", area: "frontend", level: 3 },
    { name: "HTML", area: "frontend", level: 3 },
    { name: "redux-form", area: "frontend", level: 3 },
    { name: "React Hook Form", area: "frontend", level: 3 },
    { name: "Tailwind CSS", area: "frontend", level: 3 },
    { name: "Radix", area: "frontend", level: 3 },
    { name: "Jest", area: "frontend", level: 3 },
    { name: "React Testing Library", area: "frontend", level: 3 },
    { name: "CRA", area: "frontend", level: 4 },
    { name: "i18next", area: "frontend", level: 4 },
    { name: "next-intl", area: "frontend", level: 4 },
    { name: "Node.js", area: "backend", level: 1 },
    { name: "Express", area: "backend", level: 2 },
    { name: "Prisma", area: "backend", level: 2 },
    { name: "PostgreSQL", area: "backend", level: 2 },
    { name: "Docker", area: "backend", level: 3 },
    { name: "REST API", area: "backend", level: 3 },
    { name: "zod", area: "backend", level: 3 },
    { name: "Vitest", area: "backend", level: 3 },
    { name: "Supertest", area: "backend", level: 3 },
    { name: "GitHub Actions", area: "backend", level: 4 },
    { name: "Google OAuth", area: "backend", level: 4 },
    { name: "Vercel", area: "backend", level: 4 },
    { name: "Render", area: "backend", level: 4 },
    { name: "Git", area: "shared" },
    { name: "Claude Code", area: "shared" },
    { name: "Cursor", area: "shared" },
];

export function getCloud(area: "frontend" | "backend"): readonly Tech[] {
    return techs.filter((t) => t.area === area || t.area === "shared");
}

export function getTileSummary(
    area: "frontend" | "backend",
    limit = 5,
): { names: string[]; restCount: number } {
    const areaItems = techs.filter(
        (t): t is FrontendTech | BackendTech => t.area === area,
    );
    const sorted = [...areaItems].sort((a, b) => a.level - b.level);
    const names = sorted.slice(0, limit).map((t) => t.name);
    const sharedCount = techs.filter((t) => t.area === "shared").length;
    return {
        names,
        restCount: Math.max(0, areaItems.length - limit) + sharedCount,
    };
}
