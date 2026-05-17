import { z } from "zod";

export const orderStatusSchema = z.enum([
  "PENDING",
  "PACKING",
  "SHIPPING",
  "COMPLETED",
  "RETURNED",
  "CANCELLED",
]);

export const createOrderSchema = z.object({
  customerId: z.string().uuid().optional().or(z.literal("")),
  status: orderStatusSchema.default("PENDING"),
  currency: z.string().min(3).default("VND"),
  notes: z.string().optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.preprocess((v) => Number(v), z.number().int().positive()),
      }),
    )
    .min(1),
});

export type CreateOrderInput = z.input<typeof createOrderSchema>;
