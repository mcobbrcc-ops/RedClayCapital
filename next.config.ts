import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingExcludes: { "*": ["./docs/**/*", "./tests/**/*", "./.tmp/**/*", "./.data/**/*", "./.git/**/*"] },
  turbopack: {
    root: __dirname
  },
  images: {
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
