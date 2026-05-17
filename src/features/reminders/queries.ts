import "server-only";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function listRemindersByCustomer(customerId: string) {
  const { user } = await requireAuth();
  return prisma.reminder.findMany({
    where: { userId: user.id, customerId },
    orderBy: [{ completedAt: "asc" }, { dueAt: "asc" }],
    take: 200,
  });
}

