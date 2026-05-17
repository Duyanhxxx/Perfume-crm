"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInAction(input: { email: string; password: string; next?: string }) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false as const, message: "Missing Supabase env. Visit /setup." };
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });
  if (error) return { ok: false as const, message: error.message };
  redirect(input.next ?? "/dashboard");
}

export async function signUpAction(input: { email: string; password: string }) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false as const, message: "Missing Supabase env. Visit /setup." };
  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  });
  if (error) return { ok: false as const, message: error.message };
  redirect("/login");
}

export async function forgotPasswordAction(input: { email: string }) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false as const, message: "Missing Supabase env. Visit /setup." };
  const origin = (await headers()).get("origin") ?? "";
  const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
    redirectTo: `${origin}/reset-password`,
  });
  if (error) return { ok: false as const, message: error.message };
  return { ok: true as const };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/setup");
  await supabase.auth.signOut();
  redirect("/login");
}
