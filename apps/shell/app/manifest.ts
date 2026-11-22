import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Campuz360',
    short_name: 'Campuz360',
    description: 'Connected campus experiences',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4fafd',
    theme_color: '#00b3ee',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
