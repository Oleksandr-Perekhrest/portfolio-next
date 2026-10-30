// outsource dependencies
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const perfectionistRules = {
    "perfectionist/sort-imports": [
        "error",
        {
            type: "line-length",
            order: "asc",
            sortSideEffects: false,
            newlinesBetween: 0,
            internalPattern: ["^@/"],
            groups: [
                {
                    group: [
                        "value-builtin",
                        "type-builtin",
                        "value-external",
                        "type-external",
                    ],
                    commentAbove: "outsource dependencies",
                },
                { newlinesBetween: 1 },
                {
                    group: [
                        "type-internal",
                        "value-internal",
                        "type-parent",
                        "value-parent",
                        "type-sibling",
                        "value-sibling",
                        "type-index",
                        "value-index",
                    ],
                    commentAbove: "local dependencies",
                },
            ],
        },
    ],
    "perfectionist/sort-named-imports": [
        "error",
        { type: "line-length", order: "asc" },
    ],
};

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        plugins: {
            perfectionist,
        },
        rules: {
            ...perfectionistRules,
        },
    },
    prettierConfig,
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
