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
};

export default createNextIntlPlugin()(nextConfig);
