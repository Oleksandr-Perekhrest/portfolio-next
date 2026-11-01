// outsource dependencies
import { it, expect, describe } from "@jest/globals";

// local dependencies
import { journey } from "./journey";
import { projects } from "./projects";
import en from "../../messages/en.json";
import uk from "../../messages/uk.json";
import { languages } from "./languages";
import { commercial } from "./commercial";

describe("projects message key parity", () => {
    it("every project id has a key in en.json and uk.json", () => {
        const enProjects = en.Experience.projects as Record<string, unknown>;
        const ukProjects = uk.Experience.projects as Record<string, unknown>;
        for (const project of projects) {
            expect(enProjects[project.id]).toBeDefined();
            expect(ukProjects[project.id]).toBeDefined();
        }
    });
});

describe("commercial message key parity", () => {
    it("every commercial id has a key in en.json and uk.json", () => {
        const enItems = en.Experience.commercial.items as Record<
            string,
            unknown
        >;
        const ukItems = uk.Experience.commercial.items as Record<
            string,
            unknown
        >;
        for (const item of commercial) {
            expect(enItems[item.id]).toBeDefined();
            expect(ukItems[item.id]).toBeDefined();
        }
    });
});

describe("journey message key parity", () => {
    it("every journey id has a key in en.json and uk.json", () => {
        const enJourney = en.About.journey as Record<string, unknown>;
        const ukJourney = uk.About.journey as Record<string, unknown>;
        for (const entry of journey) {
            expect(enJourney[entry.id]).toBeDefined();
            expect(ukJourney[entry.id]).toBeDefined();
        }
    });
});

describe("languages message key parity", () => {
    it("every language code has a key in en.json and uk.json", () => {
        const enLangs = en.Experience.languages as Record<string, unknown>;
        const ukLangs = uk.Experience.languages as Record<string, unknown>;
        for (const lang of languages) {
            expect(enLangs[lang.code]).toBeDefined();
            expect(ukLangs[lang.code]).toBeDefined();
        }
    });
});
