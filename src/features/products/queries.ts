import "server-only";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function listProducts(input?: { q?: string }) {
  const { user } = await requireAuth();
  const q = input?.q?.trim();

  return prisma.product.findMany({
    where: {
      userId: user.id,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { brand: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

