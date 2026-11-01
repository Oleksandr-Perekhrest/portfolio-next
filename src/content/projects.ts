export type Project = {
    id: "authkit";
    name: string;
    repoUrl: string;
    demoUrl: string;
    stack: readonly string[];
};

export const projects = [
    {
        id: "authkit",
        name: "authkit-next-express",
        repoUrl: "https://github.com/Oleksandr-Perekhrest/authkit-next-express",
        demoUrl: "https://authkit-web.vercel.app",
        stack: ["Next.js", "Express", "PostgreSQL", "Docker"],
    },
] as const satisfies readonly Project[];
