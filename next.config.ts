// outsource dependencies
import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    sassOptions: {
        loadPaths: [path.join(__dirname, "src")],
    },
};

export default nextConfig;
