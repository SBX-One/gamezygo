import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.steamstatic.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/subscription",
        destination: "/bundle",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
