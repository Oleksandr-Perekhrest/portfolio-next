export type Language = {
    code: "uk" | "en" | "cs";
    level: "native" | "C1" | "B2";
};

export const languages = [
    { code: "uk", level: "native" },
    { code: "en", level: "B2" },
    { code: "cs", level: "C1" },
] as const satisfies readonly Language[];
