import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  webpack: (config) => {
    config.output.uniqueName = 'campuz360-nexus';
    return config;
  },
  basePath: '/nexus',
  transpilePackages: ['@campuz360/ui', '@campuz360/auth', '@campuz360/contracts'],
};

export default nextConfig;
