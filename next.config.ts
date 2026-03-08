import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "utfs.io" }, // UploadThing
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "*.cloudfront.net" }, // AWS CloudFront CDN
      // Thêm các domain ảnh khác tùy project
    ],
  },
};

export default nextConfig;
