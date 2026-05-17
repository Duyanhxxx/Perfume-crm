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
      productName: p.name,
      quantity: i.quantity,
      unitCost: p.costPrice,
      unitPrice: p.sellPrice,
    };
  });

  const toNumber = (v: { toString(): string }) => Number(v.toString());
  const subtotal = items
    .reduce((acc, i) => acc + toNumber(i.unitPrice) * i.quantity, 0)
    .toFixed(0);
  const cost = items
    .reduce((acc, i) => acc + toNumber(i.unitCost) * i.quantity, 0)
    .toFixed(0);
  const profit = items
    .reduce(
      (acc, i) => acc + (toNumber(i.unitPrice) - toNumber(i.unitCost)) * i.quantity,
      0,
    )
    .toFixed(0);

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
        shippingFee: "0",
        total: subtotal,
        cost,
        profit,
        currency: input.currency,
        notes: input.notes || null,
        items: {
          create: items.map((i) => ({
            userId: user.id,
            productId: i.productId,
            productName: i.productName,
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
