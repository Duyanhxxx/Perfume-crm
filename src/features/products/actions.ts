"use server";

import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/activity";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { upsertProductSchema } from "@/features/products/schemas";

export async function upsertProductAction(raw: unknown) {
  const input = upsertProductSchema.parse(raw);
  const { user } = await requireAuth();

  const data = {
    name: input.name,
    brand: input.brand || null,
    volumeMl: input.volumeMl ?? null,
    costPrice: input.costPrice,
    sellPrice: input.sellPrice,
    stock: input.stock,
    lowStockThreshold: input.lowStockThreshold ?? 5,
    description: input.description || null,
    imageUrl: input.imageUrl || null,
  };

  const id = input.id
    ? (() => {
        return prisma.product
          .updateMany({ where: { id: input.id, userId: user.id }, data })
          .then(() => input.id as string);
      })()
    : prisma.product
        .create({ data: { userId: user.id, ...data } })
        .then((p: { id: string }) => p.id);

  const productId = await id;

  await logActivity({
    userId: user.id,
    action: input.id ? "product.updated" : "product.created",
    entityType: "Product",
    entityId: productId,
  });

  revalidatePath("/products");
  return { ok: true as const, id: productId };
}

export async function deleteProductAction(input: { id: string }) {
  const { user } = await requireAuth();
  await prisma.product.deleteMany({ where: { id: input.id, userId: user.id } });
  await logActivity({
    userId: user.id,
    action: "product.deleted",
    entityType: "Product",
    entityId: input.id,
  });
  revalidatePath("/products");
  return { ok: true as const };
}
