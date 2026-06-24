import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.50.120"],
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/studio",
        permanent: false,
      },
      {
        source: "/admin/:path*",
        destination: "/studio/:path*",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
