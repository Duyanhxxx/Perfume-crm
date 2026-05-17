import Link from "next/link";

import { AuthCard } from "@/features/auth/components/auth-card";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-screen-sm items-center px-6 py-12">
      <AuthCard
        title="Đặt lại mật khẩu"
        subtitle="Chúng tôi sẽ gửi link đặt lại qua email."
        footer={
          <div className="text-center">
            <Link className="text-muted-foreground hover:text-foreground" href="/login">
              Quay lại đăng nhập
            </Link>
          </div>
        }
      >
        <ForgotPasswordForm />
      </AuthCard>
    </div>
  );
}
