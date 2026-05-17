"use server";

import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/activity";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { upsertContentPostSchema } from "@/features/content/schemas";

const parseDate = (s?: string) => {
  const v = s?.trim();
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

export async function upsertContentPostAction(raw: unknown) {
  const input = upsertContentPostSchema.parse(raw);
  const { user } = await requireAuth();

  const data = {
    platform: input.platform,
    status: input.status,
    title: input.title,
    idea: input.idea || null,
    caption: input.caption || null,
    scheduledAt: parseDate(input.scheduledAt),
    postedAt: parseDate(input.postedAt),
  };

  const id = input.id
    ? (() => {
        return prisma.contentPost
          .updateMany({ where: { id: input.id, userId: user.id }, data })
          .then(() => input.id as string);
      })()
    : prisma.contentPost
        .create({ data: { userId: user.id, ...data } })
        .then((p: { id: string }) => p.id);

  const postId = await id;

  await logActivity({
    userId: user.id,
    action: input.id ? "content.updated" : "content.created",
    entityType: "ContentPost",
    entityId: postId,
  });

  revalidatePath("/content");
  return { ok: true as const, id: postId };
}

export async function deleteContentPostAction(input: { id: string }) {
  const { user } = await requireAuth();
  await prisma.contentPost.deleteMany({ where: { id: input.id, userId: user.id } });
  await logActivity({
    userId: user.id,
    action: "content.deleted",
    entityType: "ContentPost",
    entityId: input.id,
  });
  revalidatePath("/content");
  return { ok: true as const };
}

