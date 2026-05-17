import Link from "next/link";

import { AuthCard } from "@/features/auth/components/auth-card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-screen-sm items-center px-6 py-12">
      <AuthCard
        title="Tạo mật khẩu mới"
        subtitle="Chọn mật khẩu mạnh cho tài khoản quản trị."
        footer={
          <div className="text-center">
            <Link className="text-muted-foreground hover:text-foreground" href="/login">
              Quay lại đăng nhập
            </Link>
          </div>
        }
      >
        <ResetPasswordForm />
      </AuthCard>
    </div>
  );
}
