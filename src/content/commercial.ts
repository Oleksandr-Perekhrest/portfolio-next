// local dependencies
import type en from "../../messages/en.json";

export type Role = "frontend" | "backend" | "fullstack";

export type CommercialProject = {
    id: keyof (typeof en)["Experience"]["commercial"]["items"];
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
        stack: ["React", "React Native", "Redux", "Redux-Form", "Bootstrap"],
    },
    {
        id: "hrm",
        role: "fullstack",
        stack: ["Next.js", "Node.js", "Prisma", "PostgreSQL"],
    },
    {
        id: "mobileRedesign",
        role: "frontend",
        stack: ["React Native", "NativeWind", "Figma"],
    },
] as const satisfies readonly CommercialProject[];
