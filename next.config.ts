import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // The upload UI accepts files up to 10 MB. The default Server Action
      // body limit is 1 MB, which PNG screenshots routinely exceed.
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
