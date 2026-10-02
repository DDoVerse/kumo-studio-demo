import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone bundle so the demo can run in a container behind nginx.
  // Moving to Vercel means deleting this one line.
  output: "standalone",
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
