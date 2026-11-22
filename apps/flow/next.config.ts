import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  webpack: (config) => {
    config.output.uniqueName = 'campuz360-flow';
    return config;
  },
  basePath: '/flow',
  transpilePackages: ['@campuz360/ui', '@campuz360/auth', '@campuz360/contracts'],
};

export default nextConfig;
