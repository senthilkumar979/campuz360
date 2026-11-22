import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.output.uniqueName = 'campuz360-pulse';
    return config;
  },
  basePath: '/pulse',
  transpilePackages: ['@campuz360/ui', '@campuz360/auth', '@campuz360/contracts'],
};

export default nextConfig;
