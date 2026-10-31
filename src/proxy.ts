// outsource dependencies
import createMiddleware from "next-intl/middleware";

// local dependencies
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/"],
};
