// outsource dependencies
import { it, expect, describe } from "@jest/globals";

// local dependencies
import en from "../../messages/en.json";
import uk from "../../messages/uk.json";

function collectKeys(obj: unknown, prefix = ""): string[] {
    if (typeof obj !== "object" || obj === null) return [prefix];
    return Object.entries(obj as Record<string, unknown>).flatMap(
        ([key, val]) => collectKeys(val, prefix ? `${prefix}.${key}` : key),
    );
}

function collectStringValues(
    obj: unknown,
    prefix = "",
): Array<{ path: string; value: string }> {
    if (typeof obj === "string") return [{ path: prefix, value: obj }];
    if (typeof obj !== "object" || obj === null) return [];
    return Object.entries(obj as Record<string, unknown>).flatMap(
        ([key, val]) =>
            collectStringValues(val, prefix ? `${prefix}.${key}` : key),
    );
}

describe("message key parity", () => {
    it("en.json and uk.json have exactly the same key set", () => {
        const enKeys = collectKeys(en).sort();
        const ukKeys = collectKeys(uk).sort();
        const missing = enKeys.filter((k) => !ukKeys.includes(k));
        const extra = ukKeys.filter((k) => !enKeys.includes(k));
        expect({ missing, extra }).toEqual({ missing: [], extra: [] });
    });
});

describe("typography", () => {
    it("no string value contains a straight apostrophe ’ is required instead", () => {
        const STRAIGHT_APOSTROPHE = "'";
        const offenders: string[] = [];
        for (const { locale, messages } of [
            { locale: "en", messages: en as unknown },
            { locale: "uk", messages: uk as unknown },
        ]) {
            for (const { path, value } of collectStringValues(messages)) {
                if (value.includes(STRAIGHT_APOSTROPHE)) {
                    offenders.push(`${locale}: ${path}`);
                }
            }
        }
        expect(offenders).toEqual([]);
    });
});
