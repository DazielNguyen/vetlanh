import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "utfs.io" }, // UploadThing
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "*.cloudfront.net" }, // AWS CloudFront CDN
      { protocol: "https", hostname: "img.vietqr.io" }, // VietQR payment QR generation
      { protocol: "https", hostname: "images.pexels.com" }, // mock assets (TODO: replace with hosted)
      { protocol: "https", hostname: "picsum.photos" }, // placeholder images
    ],
  },
};

export default nextConfig;
