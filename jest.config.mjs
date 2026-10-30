// outsource dependencies
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import("jest").Config} */
const config = {
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    coverageDirectory: "coverage",
};

export default async function getJestConfig() {
    const resolved = await createJestConfig(config)();
    // next/jest prepends a catch-all /node_modules/ pattern that custom patterns added in
    // config cannot override; pnpm stores real files under .pnpm/<pkg>@ver/node_modules/<pkg>
    // so the catch-all blocks ESM-only packages even through symlinks — replace the whole array.
    resolved.transformIgnorePatterns = [
        "/node_modules/(?!(.pnpm/.+/node_modules/)?(next-intl|use-intl|intl-messageformat|icu-minify|@formatjs/fast-memoize|@formatjs/icu-messageformat-parser|@formatjs/icu-skeleton-parser|@formatjs/intl-localematcher|@schummar/icu-type-parser)/)",
        "^.+\\.module\\.(css|sass|scss)$",
    ];
    return resolved;
}
