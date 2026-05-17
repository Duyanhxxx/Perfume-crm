import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AuthCard } from "@/features/auth/components/auth-card";

export default function SetupPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-screen-sm items-center px-6 py-12">
      <AuthCard
        title="Cần cấu hình"
        subtitle="Thêm biến môi trường Supabase để tiếp tục."
        footer={
          <div className="flex items-center justify-between gap-3">
            <Link className="text-muted-foreground hover:text-foreground" href="/login">
              Tới trang đăng nhập
            </Link>
            <Button asChild>
              <Link href="/">Thử lại</Link>
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            Tạo file <span className="font-medium text-foreground">.env.local</span> (hoặc cấu hình
            env vars) với:
          </p>
          <pre className="rounded-md border border-border bg-secondary/30 p-3 font-mono text-xs text-foreground">
            {`NEXT_PUBLIC_SUPABASE_URL=...\nNEXT_PUBLIC_SUPABASE_ANON_KEY=...`}
          </pre>
          <p className="text-muted-foreground">Khởi động lại dev server sau khi cập nhật env vars.</p>
        </div>
      </AuthCard>
    </div>
  );
}
