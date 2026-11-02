// outsource dependencies
import { devices, defineConfig } from "@playwright/test";

const isCI = Boolean(process.env.CI);

export default defineConfig({
    testDir: "./e2e",
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
    use: {
        baseURL: "http://localhost:3100",
        locale: "en-US",
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
        },
        {
            name: "mobile-chrome",
            use: { ...devices["Pixel 7"] },
        },
    ],
    webServer: {
        command: "pnpm build && pnpm start -p 3100",
        url: "http://localhost:3100/en",
        timeout: 180_000,
        reuseExistingServer: !isCI,
    },
});
