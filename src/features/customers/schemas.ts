import { z } from "zod";

export const customerStatusSchema = z.enum(["ACTIVE", "INACTIVE", "VIP"]);

export const upsertCustomerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  phone: z.string().min(3).optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  favoriteScent: z.string().optional().or(z.literal("")),
  socialLink: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  status: customerStatusSchema.default("ACTIVE"),
});

export type UpsertCustomerInput = z.input<typeof upsertCustomerSchema>;
