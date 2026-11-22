import type { Metadata } from 'next';
import '@campuz360/ui/globals.css';

export const metadata: Metadata = {
  title: 'Campuz360',
  description: 'One platform. Connected campus experiences.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
