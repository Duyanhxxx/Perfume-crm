import "server-only";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAuth() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/setup");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await prisma.profile.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email ?? "",
      fullName: (user.user_metadata?.full_name ?? user.user_metadata?.name) || null,
    },
    update: {
      email: user.email ?? "",
      fullName: (user.user_metadata?.full_name ?? user.user_metadata?.name) || null,
    },
  });

  return { supabase, user };
}
