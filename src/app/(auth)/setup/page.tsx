import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AuthCard } from "@/features/auth/components/auth-card";

export default function SetupPage() {
  return (
    <AuthCard
      title="Setup required"
      subtitle="Add Supabase environment variables to continue."
      footer={
        <div className="flex items-center justify-between gap-3">
          <Link className="text-muted-foreground hover:text-foreground" href="/login">
            Go to login
          </Link>
          <Button asChild>
            <Link href="/">Retry</Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-sm">
        <p className="text-muted-foreground">
          Create a <span className="font-medium text-foreground">.env.local</span> file (or set
          env vars) with:
        </p>
        <pre className="rounded-md border border-border bg-secondary/30 p-3 font-mono text-xs text-foreground">
          {`NEXT_PUBLIC_SUPABASE_URL=...\nNEXT_PUBLIC_SUPABASE_ANON_KEY=...`}
        </pre>
        <p className="text-muted-foreground">Restart the dev server after updating env vars.</p>
      </div>
    </AuthCard>
  );
}
