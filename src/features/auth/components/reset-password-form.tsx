"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { resetPasswordSchema } from "@/features/auth/schemas";

type Values = {
  password: string;
};

export function ResetPasswordForm() {
  const router = useRouter();
  const form = useForm<Values>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  });
  const [pending, setPending] = React.useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        setPending(true);
        try {
          const supabase = createSupabaseBrowserClient();
          if (!supabase) {
            toast.error("Thiếu biến môi trường Supabase. Vui lòng vào /setup.");
            return;
          }
          const { error } = await supabase.auth.updateUser({
            password: values.password,
          });
          if (error) toast.error(error.message);
          else {
            toast.success("Đã cập nhật mật khẩu.");
            router.replace("/dashboard");
          }
        } finally {
          setPending(false);
        }
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu mới</Label>
        <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
      </div>
      <Button className="w-full" type="submit" disabled={pending}>
        Cập nhật mật khẩu
      </Button>
    </form>
  );
}
