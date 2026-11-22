import { Badge, Button, Card, Input, Label, Logo } from '@campuz360/ui';
import { resetPasswordAction, signInAction, signUpAction } from '../actions';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4 py-12">
      <div className="flex items-center gap-3">
        <Logo />
        <div>
          <Badge>Nexus</Badge>
          <h1 className="text-3xl font-extrabold tracking-tight">Sign in</h1>
        </div>
      </div>
      <Card accent="#00b3ee">
        <form action={signInAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Campus email</Label>
            <Input id="email" name="email" type="email" required placeholder="you@campus.edu" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={8} />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Card>
      <Card>
        <h2 className="mb-3 font-bold">Create account</h2>
        <form action={signUpAction} className="space-y-3">
          <Input name="displayName" placeholder="Display name" />
          <Input name="email" type="email" required placeholder="Email" />
          <Input name="password" type="password" required minLength={8} placeholder="Password" />
          <Button type="submit" variant="outline" className="w-full">
            Sign up
          </Button>
        </form>
      </Card>
      <Card>
        <h2 className="mb-3 font-bold">Forgot password</h2>
        <form action={resetPasswordAction} className="flex gap-2">
          <Input name="email" type="email" required placeholder="Email" />
          <Button type="submit" variant="ghost">
            Send link
          </Button>
        </form>
        <p className="mt-2 text-xs text-mut">We never reveal whether an email exists.</p>
      </Card>
      <p className="text-center text-sm text-mut">
        {/* Plain <a> to Shell origin — Next Link would stay under /nexus basePath */}
        <a href={process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'} className="text-blue">
          Back to Shell
        </a>
      </p>
    </main>
  );
}
