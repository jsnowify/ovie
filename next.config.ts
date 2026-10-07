import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    // Allow next/image to load files from our Cloudinary account only.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dp9bjis3z/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Allow quality={100} on <Image>. Next only allows listed values (default is 75).
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
