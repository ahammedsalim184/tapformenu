import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.35",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.35",
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;