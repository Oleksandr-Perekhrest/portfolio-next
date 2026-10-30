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
    {
        files: ["src/components/**/*.{ts,tsx}", "src/app/**/*.{ts,tsx}"],
        ignores: ["**/*.test.tsx", "src/app/global-not-found.tsx"],
        rules: {
            "no-restricted-syntax": [
                "error",
                {
                    selector: "JSXText[value=/[a-zA-Zа-яА-ЯіїєґІЇЄҐ]/]",
                    message: "Move user-visible text into messages/*.json",
                },
                {
                    selector:
                        "JSXAttribute[name.name=/^(aria-label|alt|title|placeholder)$/] > Literal[value=/[a-zA-Zа-яА-ЯіїєґІЇЄҐ]/]",
                    message: "Move user-visible text into messages/*.json",
                },
                {
                    selector:
                        "JSXElement > JSXExpressionContainer > Literal[value=/[a-zA-Zа-яА-ЯіїєґІЇЄҐ]/]",
                    message: "Move user-visible text into messages/*.json",
                },
            ],
        },
    },
    prettierConfig,
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
