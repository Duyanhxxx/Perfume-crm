"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema } from "@/features/auth/schemas";
import { signInAction } from "@/features/auth/actions";

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

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          const res = await signInAction({ ...values, next });
          if (res?.ok === false) toast.error(res.message);
        });
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" autoComplete="email" {...form.register("email")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...form.register("password")}
        />
      </div>
      <Button className="w-full" type="submit" disabled={pending}>
        Sign in
      </Button>
    </form>
  );
}

