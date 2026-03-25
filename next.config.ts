import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "docs",
  basePath: "/futurescope",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
