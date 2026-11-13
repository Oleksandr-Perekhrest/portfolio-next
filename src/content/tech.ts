// outsource dependencies
import type { SimpleIcon } from "simple-icons";
import {
    siReact,
    siRedux,
    siPrisma,
    siExpress,
    siNextdotjs,
    siNodedotjs,
    siJavascript,
    siPostgresql,
    siTypescript,
} from "simple-icons";

type FrontendTech = {
    name: string;
    area: "frontend";
    level: 1 | 2 | 3 | 4;
    icon?: SimpleIcon;
};
type BackendTech = {
    name: string;
    area: "backend";
    level: 1 | 2 | 3 | 4;
    icon?: SimpleIcon;
};
type SharedTech = { name: string; area: "shared" };
export type Tech = FrontendTech | BackendTech | SharedTech;

export const techs: readonly Tech[] = [
    { name: "React", area: "frontend", level: 1, icon: siReact },
    { name: "Next.js", area: "frontend", level: 2, icon: siNextdotjs },
    { name: "TypeScript", area: "frontend", level: 2, icon: siTypescript },
    { name: "Redux", area: "frontend", level: 2, icon: siRedux },
    { name: "React Native", area: "frontend", level: 2, icon: siReact },
    { name: "JavaScript", area: "frontend", level: 2, icon: siJavascript },
    { name: "SCSS", area: "frontend", level: 3 },
    { name: "CSS", area: "frontend", level: 3 },
    { name: "HTML", area: "frontend", level: 3 },
    { name: "Vite", area: "frontend", level: 3 },
    { name: "Bootstrap", area: "frontend", level: 3 },
    { name: "Tailwind CSS", area: "frontend", level: 3 },
    { name: "shadcn/ui", area: "frontend", level: 3 },
    { name: "Radix", area: "frontend", level: 3 },
    { name: "redux-form", area: "frontend", level: 3 },
    { name: "Redux Toolkit", area: "frontend", level: 3 },
    { name: "RTK Query", area: "frontend", level: 3 },
    { name: "redux-saga", area: "frontend", level: 3 },
    { name: "React Hook Form", area: "frontend", level: 3 },
    { name: "TanStack Form", area: "frontend", level: 3 },
    { name: "TanStack Router", area: "frontend", level: 3 },
    { name: "TanStack Table", area: "frontend", level: 3 },
    { name: "Figma", area: "frontend", level: 3 },
    { name: "Jest", area: "frontend", level: 3 },
    { name: "Playwright", area: "frontend", level: 3 },
    { name: "React Testing Library", area: "frontend", level: 3 },
    { name: "MSW", area: "frontend", level: 3 },
    { name: "CRA", area: "frontend", level: 4 },
    { name: "i18next", area: "frontend", level: 4 },
    { name: "next-intl", area: "frontend", level: 4 },
    { name: "NativeWind", area: "frontend", level: 4 },
    { name: "React Navigation", area: "frontend", level: 4 },
    { name: "MobX", area: "frontend", level: 4 },
    { name: "Formik", area: "frontend", level: 4 },
    { name: "Yup", area: "frontend", level: 4 },
    { name: "Recharts", area: "frontend", level: 4 },
    { name: "dnd-kit", area: "frontend", level: 4 },
    { name: "axe", area: "frontend", level: 4 },
    { name: "Lighthouse CI", area: "frontend", level: 4 },
    { name: "Node.js", area: "backend", level: 1, icon: siNodedotjs },
    { name: "Express", area: "backend", level: 2, icon: siExpress },
    { name: "Prisma", area: "backend", level: 2, icon: siPrisma },
    { name: "PostgreSQL", area: "backend", level: 2, icon: siPostgresql },
    { name: "Docker", area: "backend", level: 3 },
    { name: "REST API", area: "backend", level: 3 },
    { name: "GraphQL", area: "backend", level: 3 },
    { name: "zod", area: "backend", level: 3 },
    { name: "Vitest", area: "backend", level: 3 },
    { name: "Supertest", area: "backend", level: 3 },
    { name: "GitHub Actions", area: "backend", level: 4 },
    { name: "Google OAuth", area: "backend", level: 4 },
    { name: "arctic", area: "backend", level: 4 },
    { name: "Vercel", area: "backend", level: 4 },
    { name: "Render", area: "backend", level: 4 },
    { name: "Resend", area: "backend", level: 4 },
    { name: "Git", area: "shared" },
    { name: "Git Flow", area: "shared" },
    { name: "pnpm", area: "shared" },
    { name: "lefthook", area: "shared" },
    { name: "Conventional Commits", area: "shared" },
    { name: "ESLint", area: "shared" },
    { name: "Prettier", area: "shared" },
    { name: "Claude Code", area: "shared" },
    { name: "Cursor", area: "shared" },
    { name: "Gemini", area: "shared" },
    { name: "Codex", area: "shared" },
];

export function getCloud(
    area: "frontend" | "backend",
    list: readonly Tech[] = techs,
): readonly Tech[] {
    const areaItems = list.filter(
        (t): t is FrontendTech | BackendTech => t.area === area,
    );
    const sharedItems = list.filter((t) => t.area === "shared");
    const sorted = [...areaItems].sort((a, b) => a.level - b.level);
    return [...sorted, ...sharedItems];
}

export function getTileSummary(
    area: "frontend" | "backend",
    limit = 5,
    list: readonly Tech[] = techs,
): { names: string[]; restCount: number } {
    const areaItems = list.filter(
        (t): t is FrontendTech | BackendTech => t.area === area,
    );
    const sorted = [...areaItems].sort((a, b) => a.level - b.level);
    const names = sorted.slice(0, limit).map((t) => t.name);
    const sharedCount = list.filter((t) => t.area === "shared").length;
    return {
        names,
        restCount: Math.max(0, areaItems.length - limit) + sharedCount,
    };
}
