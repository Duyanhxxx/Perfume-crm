"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/activity";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createOrderSchema, orderStatusSchema } from "@/features/orders/schemas";

export async function createOrderAction(raw: unknown) {
  const input = createOrderSchema.parse(raw);
  const { user } = await requireAuth();

  const productIds = Array.from(new Set(input.items.map((i) => i.productId)));
  const products = (await prisma.product.findMany({
    where: { userId: user.id, id: { in: productIds } },
  })) as import("@prisma/client").Product[];
  const byId = new Map(products.map((p) => [p.id, p]));

  const items = input.items.map((i) => {
    const p = byId.get(i.productId);
    if (!p) throw new Error("Invalid product");
    return {
      productId: p.id,
      quantity: i.quantity,
      unitCost: p.costPrice,
      unitPrice: p.sellPrice,
    };
  });

  const toCents = (v: { toString(): string }) =>
    Math.round(Number(v.toString()) * 100);
  const subtotalCents = items.reduce(
    (acc, i) => acc + toCents(i.unitPrice) * i.quantity,
    0,
  );
  const profitCents = items.reduce(
    (acc, i) =>
      acc + (toCents(i.unitPrice) - toCents(i.unitCost)) * i.quantity,
    0,
  );
  const subtotal = (subtotalCents / 100).toFixed(2);
  const profit = (profitCents / 100).toFixed(2);

  const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    for (const i of items) {
      await tx.product.updateMany({
        where: { id: i.productId, userId: user.id },
        data: { stock: { decrement: i.quantity } },
      });
    }

    return tx.order.create({
      data: {
        userId: user.id,
        customerId: input.customerId ? input.customerId : null,
        status: input.status,
        subtotal,
        total: subtotal,
        profit,
        currency: input.currency,
        notes: input.notes || null,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitCost: i.unitCost,
            unitPrice: i.unitPrice,
          })),
        },
      },
    });
  });

  await logActivity({
    userId: user.id,
    action: "order.created",
    entityType: "Order",
    entityId: order.id,
  });

  revalidatePath("/orders");
  revalidatePath("/products");
  return { ok: true as const, id: order.id };
}

export async function updateOrderStatusAction(input: { id: string; status: string }) {
  const { user } = await requireAuth();
  const status = orderStatusSchema.parse(input.status);
  await prisma.order.updateMany({
    where: { id: input.id, userId: user.id },
    data: { status },
  });
  await logActivity({
    userId: user.id,
    action: "order.status_updated",
    entityType: "Order",
    entityId: input.id,
    metadata: { status },
  });
  revalidatePath("/orders");
  return { ok: true as const };
}
