// outsource dependencies
import type { MetadataRoute } from "next";

// local dependencies
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: "*", allow: "/" },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
