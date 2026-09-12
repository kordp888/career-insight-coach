import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() { return [{source:"/demo/:path*",destination:"/coach/:path*",permanent:true}]; },
};

export default nextConfig;
