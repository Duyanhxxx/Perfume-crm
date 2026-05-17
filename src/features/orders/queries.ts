import "server-only";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function listOrders() {
  const { user } = await requireAuth();
  return prisma.order.findMany({
    where: { userId: user.id },
    include: { customer: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

