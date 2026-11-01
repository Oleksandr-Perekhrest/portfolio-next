// local dependencies
import type en from "../../messages/en.json";

declare module "use-intl" {
    interface AppConfig {
        Locale: "en" | "uk";
        Messages: typeof en;
    }
}
