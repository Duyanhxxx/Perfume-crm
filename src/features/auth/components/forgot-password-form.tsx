"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema } from "@/features/auth/schemas";
import { forgotPasswordAction } from "@/features/auth/actions";

type Values = {
  email: string;
};

export function ForgotPasswordForm() {
  const form = useForm<Values>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const [pending, startTransition] = React.useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          const res = await forgotPasswordAction(values);
          if (res?.ok === false) toast.error(res.message);
          else toast.success("Đã gửi email đặt lại mật khẩu.");
        });
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" autoComplete="email" {...form.register("email")} />
      </div>
      <Button className="w-full" type="submit" disabled={pending}>
        Gửi link đặt lại
      </Button>
    </form>
  );
}
