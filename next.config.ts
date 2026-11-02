// outsource dependencies
import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    experimental: {
        globalNotFound: true,
    },
    sassOptions: {
        loadPaths: [path.join(__dirname, "src")],
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    // CV PDF is embedded in a same-origin iframe inside the CV dialog
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
                    },
                ],
            },
        ];
    },
};

export default createNextIntlPlugin()(nextConfig);
