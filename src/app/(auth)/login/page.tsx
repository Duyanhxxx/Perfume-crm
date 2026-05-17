import Link from "next/link";

import { AuthCard } from "@/features/auth/components/auth-card";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export default async function LoginPage(props: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await props.searchParams;

  return (
    <AuthCard
      title="Sign in"
      subtitle="Access your perfume CRM dashboard."
      footer={
        <div className="flex items-center justify-between">
          <Link className="text-muted-foreground hover:text-foreground" href="/forgot-password">
            Forgot password?
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/register">
            Create account
          </Link>
        </div>
      }
    >
      <SignInForm next={next} />
    </AuthCard>
  );
}

