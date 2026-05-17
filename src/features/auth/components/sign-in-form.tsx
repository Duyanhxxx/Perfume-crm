"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema } from "@/features/auth/schemas";
import { signInAction, signInWithGoogleAction } from "@/features/auth/actions";

type Values = {
  email: string;
  password: string;
};

export function SignInForm({ next }: { next?: string }) {
  const form = useForm<Values>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const [pending, startTransition] = React.useTransition();
  const [rememberMe, setRememberMe] = React.useState(false);

  React.useEffect(() => {
    const savedEmail = window.localStorage.getItem("scentflow.login.email");
    if (savedEmail) {
      form.setValue("email", savedEmail);
      setRememberMe(true);
    }
  }, [form]);

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          if (rememberMe) window.localStorage.setItem("scentflow.login.email", values.email);
          else window.localStorage.removeItem("scentflow.login.email");

          const res = await signInAction({ ...values, next });
          if (res?.ok === false) toast.error(res.message);
        });
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          autoComplete="email"
          placeholder="director@maison-parfum.com"
          {...form.register("email")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...form.register("password")}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-muted-foreground">
          <input
            className="h-4 w-4 rounded border border-input bg-background accent-primary"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Ghi nhớ email
        </label>
        <Link className="text-xs text-primary hover:underline" href="/forgot-password">
          Quên mật khẩu?
        </Link>
      </div>

      <Button className="w-full" type="submit" disabled={pending}>
        Đăng nhập
      </Button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground">HOẶC</span>
        </div>
      </div>

      <Button
        className="w-full justify-center"
        type="button"
        variant="outline"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const res = await signInWithGoogleAction({ next });
            if (res?.ok === false) toast.error(res.message);
          });
        }}
      >
        <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
          <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303C33.73 32.657 29.24 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.992 6.053 29.733 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.651-.389-3.917Z"
          />
          <path
            fill="#FF3D00"
            d="M6.306 14.691l6.571 4.819C14.655 16.108 19.01 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.992 6.053 29.733 4 24 4c-7.682 0-14.42 4.327-17.694 10.691Z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.62 0 10.753-2.112 14.597-5.553l-6.732-5.705C29.824 34.313 27.053 35.999 24 36c-5.218 0-9.698-3.318-11.288-7.946l-6.522 5.025C9.413 39.556 16.233 44 24 44Z"
          />
          <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303a12.07 12.07 0 0 1-3.438 4.742h.002l6.732 5.705C38.122 38.8 44 34.5 44 24c0-1.341-.138-2.651-.389-3.917Z"
          />
        </svg>
        Tiếp tục với Google
      </Button>
    </form>
  );
}
