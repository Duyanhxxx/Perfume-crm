"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpSchema } from "@/features/auth/schemas";
import { signUpAction } from "@/features/auth/actions";

type Values = {
  email: string;
  password: string;
};

export function SignUpForm() {
  const form = useForm<Values>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });
  const [pending, startTransition] = React.useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          const res = await signUpAction(values);
          if (res?.ok === false) toast.error(res.message);
          else toast.success("Tạo tài khoản thành công. Bạn có thể đăng nhập ngay.");
        });
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" autoComplete="email" {...form.register("email")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...form.register("password")}
        />
      </div>
      <Button className="w-full" type="submit" disabled={pending}>
        Tạo tài khoản
      </Button>
    </form>
  );
}
