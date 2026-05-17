"use server";

import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/activity";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { upsertCustomerSchema } from "@/features/customers/schemas";

export async function upsertCustomerAction(raw: unknown) {
  const input = upsertCustomerSchema.parse(raw);
  const { user } = await requireAuth();

  const data = {
    name: input.name,
    phone: input.phone || null,
    address: input.address || null,
    favoriteScent: input.favoriteScent || null,
    socialLink: input.socialLink || null,
    notes: input.notes || null,
    status: input.status,
  };

  const id = input.id
    ? (() => {
        return prisma.customer
          .updateMany({ where: { id: input.id, userId: user.id }, data })
          .then(() => input.id as string);
      })()
    : prisma.customer
        .create({ data: { userId: user.id, ...data } })
        .then((c) => c.id);

  const customerId = await id;

  await logActivity({
    userId: user.id,
    action: input.id ? "customer.updated" : "customer.created",
    entityType: "Customer",
    entityId: customerId,
  });

  revalidatePath("/customers");
  return { ok: true as const, id: customerId };
}

export async function deleteCustomerAction(input: { id: string }) {
  const { user } = await requireAuth();
  await prisma.customer.deleteMany({ where: { id: input.id, userId: user.id } });
  await logActivity({
    userId: user.id,
    action: "customer.deleted",
    entityType: "Customer",
    entityId: input.id,
  });
  revalidatePath("/customers");
  return { ok: true as const };
}
