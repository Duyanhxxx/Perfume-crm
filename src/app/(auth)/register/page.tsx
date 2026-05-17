import Link from "next/link";

import { AuthCard } from "@/features/auth/components/auth-card";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-screen-sm items-center px-6 py-12">
      <AuthCard
        title="Tạo tài khoản"
        subtitle="Thiết lập 1 quản trị viên. Dùng email công ty."
        footer={
          <div className="text-center">
            <Link className="text-muted-foreground hover:text-foreground" href="/login">
              Quay lại đăng nhập
            </Link>
          </div>
        }
      >
        <SignUpForm />
      </AuthCard>
    </div>
  );
}
