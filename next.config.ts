import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버에 도커로 올리기 위한 독립 실행 번들.
  // Vercel 로 옮길 때는 이 줄만 지우면 된다.
  output: "standalone",
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
