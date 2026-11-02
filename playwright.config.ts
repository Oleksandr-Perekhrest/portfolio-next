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
    // Two-server array keeps E2E from sending real emails:
    // the mock intercepts all Resend API calls before the app server starts.
    webServer: [
        {
            command: "node e2e/mock-resend.mts",
            url: "http://localhost:3101/__health",
            reuseExistingServer: false,
        },
        {
            command: "pnpm build && pnpm start -p 3100",
            url: "http://localhost:3100/en",
            timeout: 180_000,
            // a leftover server on 3100 would silently serve a stale build
            reuseExistingServer: false,
            env: {
                RESEND_BASE_URL: "http://localhost:3101",
                RESEND_API_KEY: "re_e2e_test",
                CONTACT_TO_EMAIL: "owner@example.test",
            },
        },
    ],
});
