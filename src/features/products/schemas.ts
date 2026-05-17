import { z } from "zod";

const money = z
  .string()
  .min(1)
  .refine((v) => !Number.isNaN(Number(v)), { message: "Invalid number" });

export const upsertProductSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  brand: z.string().optional().or(z.literal("")),
  volumeMl: z.coerce.number().int().positive().optional(),
  costPrice: money,
  sellPrice: money,
  stock: z.coerce.number().int().nonnegative(),
  lowStockThreshold: z.coerce.number().int().nonnegative().optional(),
  description: z.string().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type UpsertProductInput = z.input<typeof upsertProductSchema>;
