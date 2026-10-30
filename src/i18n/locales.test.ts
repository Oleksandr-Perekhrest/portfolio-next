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

describe("message key parity", () => {
    it("en.json and uk.json have exactly the same key set", () => {
        const enKeys = collectKeys(en).sort();
        const ukKeys = collectKeys(uk).sort();
        const missing = enKeys.filter((k) => !ukKeys.includes(k));
        const extra = ukKeys.filter((k) => !enKeys.includes(k));
        expect({ missing, extra }).toEqual({ missing: [], extra: [] });
    });
});
