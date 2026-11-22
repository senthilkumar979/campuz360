import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.output.uniqueName = 'campuz360-connect';
    return config;
  },
  basePath: '/connect',
  transpilePackages: ['@campuz360/ui', '@campuz360/auth', '@campuz360/contracts'],
};

export default nextConfig;
