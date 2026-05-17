import "server-only";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { customerStatusSchema } from "@/features/customers/schemas";

export async function listCustomers(input?: { q?: string; status?: string }) {
  const { user } = await requireAuth();
  const q = input?.q?.trim();
  const status = input?.status ? customerStatusSchema.parse(input.status) : undefined;

  const customers = await prisma.customer.findMany({
    where: {
      userId: user.id,
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const ids = customers.map((c) => c.id);
  if (ids.length === 0) return customers.map((c) => ({ ...c, lastEngagement: null, lifetimeValue: "0.00" }));

  const agg = await prisma.order.groupBy({
    by: ["customerId"],
    where: { userId: user.id, customerId: { in: ids } },
    _sum: { total: true },
    _max: { createdAt: true },
  });

  const byId = new Map(
    agg.map((a) => [
      a.customerId as string,
      {
        lastEngagement: a._max.createdAt ?? null,
        lifetimeValue: a._sum.total ? a._sum.total.toString() : "0.00",
      },
    ]),
  );

  return customers.map((c) => {
    const s = byId.get(c.id);
    return { ...c, lastEngagement: s?.lastEngagement ?? null, lifetimeValue: s?.lifetimeValue ?? "0.00" };
  });
}
