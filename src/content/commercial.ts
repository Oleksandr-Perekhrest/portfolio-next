export type Role = "frontend" | "backend" | "fullstack";

export type CommercialProject = {
    id: string;
    role: Role;
    stack: readonly string[];
};

export const roleLabels: Record<Role, string> = {
    frontend: "Frontend",
    backend: "Backend",
    fullstack: "Full-stack",
};

export const commercial = [
    {
        id: "healthcare",
        role: "frontend",
        stack: ["React", "React Native", "Redux"],
    },
    {
        id: "hr",
        role: "fullstack",
        stack: ["Node.js", "Prisma", "PostgreSQL"],
    },
] as const satisfies readonly CommercialProject[];
