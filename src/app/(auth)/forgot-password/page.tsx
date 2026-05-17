import Link from "next/link";

import { AuthCard } from "@/features/auth/components/auth-card";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-screen-sm items-center px-6 py-12">
      <AuthCard
        title="Reset password"
        subtitle="We’ll email you a reset link."
        footer={
          <div className="text-center">
            <Link className="text-muted-foreground hover:text-foreground" href="/login">
              Back to sign in
            </Link>
          </div>
        }
      >
        <ForgotPasswordForm />
      </AuthCard>
    </div>
  );
}
