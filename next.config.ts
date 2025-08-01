import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "qlltwdkrlqkkswbgjdrp.supabase.co",
    ],
  },
};

export default nextConfig;
