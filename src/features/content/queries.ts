import "server-only";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function listContentPosts() {
  const { user } = await requireAuth();
  return prisma.contentPost.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

