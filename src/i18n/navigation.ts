// outsource dependencies
import { createNavigation } from "next-intl/navigation";

// local dependencies
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
