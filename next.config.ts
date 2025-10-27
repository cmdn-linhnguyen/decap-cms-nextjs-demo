import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  
  basePath: isProd ? '/decap-cms-nextjs-demo' : undefined,
  trailingSlash: true, 
};

export default nextConfig;