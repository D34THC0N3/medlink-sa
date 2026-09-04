import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack(config) {
    config.resolve.alias["framer-motion"] = path.resolve(
      process.cwd(),
      "node_modules/framer-motion/dist/cjs/index.js"
    );
    return config;
  },
  turbopack: {
    resolveAlias: {
      "framer-motion": path.resolve(
        process.cwd(),
        "node_modules/framer-motion/dist/cjs/index.js"
      ),
    },
  },
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
