export type Project = {
    id: "authkit" | "inventory";
    name: string;
    repoUrl: string;
    demoUrl: string;
    stack: readonly string[];
};

export const projects: readonly Project[] = [
    {
        id: "authkit",
        name: "authkit-next-express",
        repoUrl: "https://github.com/Oleksandr-Perekhrest/authkit-next-express",
        demoUrl: "https://authkit-web.vercel.app",
        stack: ["Next.js", "Express", "PostgreSQL", "Docker"],
    },
    {
        id: "inventory",
        name: "inventory-react-rtk",
        repoUrl: "https://github.com/Oleksandr-Perekhrest/inventory-react-rtk",
        demoUrl: "https://warehouse-manager-demo.vercel.app",
        stack: ["React", "Vite", "Redux Toolkit", "RTK Query"],
    },
];
