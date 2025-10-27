import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', 
  distDir: 'out',   
  images: {
    unoptimized: true, 
  },
  basePath: '/decap-cms-nextjs-demo',
  reactStrictMode: true,
};

export default nextConfig;
