// local dependencies
import type en from "../../messages/en.json";

export type JourneyEntry = {
    id: keyof (typeof en)["About"]["journey"];
    year: number | "now";
};

export const journey = [
    { id: "cook", year: 2004 },
    { id: "headChef", year: 2007 },
    { id: "logistics", year: 2014 },
    { id: "headOfSales", year: 2017 },
    { id: "intoIt", year: 2022 },
    { id: "frontend", year: 2023 },
    { id: "fullstack", year: "now" },
] as const satisfies readonly JourneyEntry[];
