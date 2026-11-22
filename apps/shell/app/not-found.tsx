import Link from 'next/link';
import { Button, Card, Logo } from '@campuz360/ui';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-4">
      <Logo />
      <Card className="w-full text-center">
        <h1 className="text-3xl font-extrabold">404 – Page not found</h1>
        <p className="mt-2 text-mut">That route does not exist in Campuz360.</p>
        <Button asChild className="mt-6">
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </Card>
    </main>
  );
}
