import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  webpack(config) {
    config.resolve.alias["framer-motion"] = path.resolve(
      __dirname,
      "node_modules/framer-motion/dist/cjs/index.js"
    );
    return config;
  },
  turbopack: {
    resolveAlias: {
      "framer-motion": path.resolve(
        __dirname,
        "node_modules/framer-motion/dist/cjs/index.js"
      ),
    },
  },
  reactStrictMode: false,
};

export default nextConfig;
