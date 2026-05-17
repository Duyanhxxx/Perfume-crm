import Link from "next/link";

import { AuthCard } from "@/features/auth/components/auth-card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a strong password for your admin account."
      footer={
        <div className="text-center">
          <Link className="text-muted-foreground hover:text-foreground" href="/login">
            Back to sign in
          </Link>
        </div>
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}

