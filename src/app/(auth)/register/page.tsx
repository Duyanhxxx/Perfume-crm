import Link from "next/link";

import { AuthCard } from "@/features/auth/components/auth-card";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-screen-sm items-center px-6 py-12">
      <AuthCard
        title="Create account"
        subtitle="Single-admin setup. Use your business email."
        footer={
          <div className="text-center">
            <Link className="text-muted-foreground hover:text-foreground" href="/login">
              Back to sign in
            </Link>
          </div>
        }
      >
        <SignUpForm />
      </AuthCard>
    </div>
  );
}
