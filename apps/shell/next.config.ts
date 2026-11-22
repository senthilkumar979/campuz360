import type { NextConfig } from 'next';

const remotes = {
  nexus: process.env.NEXUS_URL ?? 'http://localhost:3001',
  flow: process.env.FLOW_URL ?? 'http://localhost:3002',
  connect: process.env.CONNECT_URL ?? 'http://localhost:3003',
  sphere: process.env.SPHERE_URL ?? 'http://localhost:3004',
  residence: process.env.RESIDENCE_URL ?? 'http://localhost:3005',
  pulse: process.env.PULSE_URL ?? 'http://localhost:3006',
};

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.output.uniqueName = 'campuz360-shell';
    return config;
  },
  transpilePackages: [
    '@campuz360/ui',
    '@campuz360/auth',
    '@campuz360/contracts',
    '@localix-ai/flowdown',
  ],
  outputFileTracingIncludes: {
    '/handbook': ['../../docs/**/*', './content/handbook/**/*', '../**/docs/**/*'],
    '/handbook/[slug]': ['../../docs/**/*', './content/handbook/**/*', '../**/docs/**/*'],
  },
  async rewrites() {
    return [
      { source: '/nexus', destination: `${remotes.nexus}/nexus` },
      { source: '/nexus/:path*', destination: `${remotes.nexus}/nexus/:path*` },
      { source: '/flow', destination: `${remotes.flow}/flow` },
      { source: '/flow/:path*', destination: `${remotes.flow}/flow/:path*` },
      { source: '/connect', destination: `${remotes.connect}/connect` },
      { source: '/connect/:path*', destination: `${remotes.connect}/connect/:path*` },
      { source: '/sphere', destination: `${remotes.sphere}/sphere` },
      { source: '/sphere/:path*', destination: `${remotes.sphere}/sphere/:path*` },
      { source: '/residence', destination: `${remotes.residence}/residence` },
      { source: '/residence/:path*', destination: `${remotes.residence}/residence/:path*` },
      { source: '/pulse', destination: `${remotes.pulse}/pulse` },
      { source: '/pulse/:path*', destination: `${remotes.pulse}/pulse/:path*` },
    ];
  },
};

export default nextConfig;
