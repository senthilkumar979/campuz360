import type { Metadata } from 'next';
import '@campuz360/ui/globals.css';

export const metadata: Metadata = {
  title: 'Pulse · Campuz360',
  description: 'Events and publishing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
