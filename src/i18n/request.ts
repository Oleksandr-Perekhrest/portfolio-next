// outsource dependencies
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";

// local dependencies
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
    // Use the explicit override when provided (e.g. getTranslations({locale})),
    // otherwise read the root param that Next.js sets per static path.
    const requested = locale ?? (await rootLocale());
    if (!hasLocale(routing.locales, requested)) {
        notFound();
    }
    return {
        locale: requested,
        messages: (await import(`../../messages/${requested}.json`)).default,
    };
});
