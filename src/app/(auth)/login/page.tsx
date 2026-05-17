import Link from "next/link";

import { SignInForm } from "@/features/auth/components/sign-in-form";

export default async function LoginPage(props: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await props.searchParams;

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center grayscale" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <h1 className="font-serif text-5xl tracking-tight">L&apos;Essence de l&apos;Artisanat</h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            The exclusive digital sanctuary for master perfumers. Manage your clients, inventory, and
            olfactory compositions with editorial precision.
          </p>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-6 py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(233,195,73,0.10),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_45%)]" />

        <div className="relative w-full max-w-md">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary">
                <path
                  d="M12 4.5c3.6 0 6.5 1.9 6.5 4.25 0 1.24-.77 2.33-2 3.08V19a2 2 0 0 1-2 2H9.5a2 2 0 0 1-2-2v-7.17c-1.23-.75-2-1.84-2-3.08C5.5 6.4 8.4 4.5 12 4.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M9 10.5c1.1.67 2.5 1.08 4 1.08s2.9-.41 4-1.08"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="font-semibold tracking-tight">L&apos;Atelier</div>
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Perfume CRM
              </div>
            </div>
          </div>

          <h2 className="font-serif text-4xl tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please enter your credentials to access the atelier.
          </p>

          <div className="mt-8 space-y-8">
            <SignInForm next={next} />

            <div className="text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link className="text-primary hover:underline" href="/register">
                Contact the administrator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
