import type { Metadata } from 'next';
import '@campuz360/ui/globals.css';

export const metadata: Metadata = {
  title: 'Flow · Campuz360',
  description: 'Workflow and leave approvals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
