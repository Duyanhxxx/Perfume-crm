import { z } from "zod";

export const createReminderSchema = z.object({
  customerId: z.string().uuid(),
  dueAt: z.string().min(1),
  note: z.string().optional().or(z.literal("")),
});

export const completeReminderSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
});

export type CreateReminderInput = z.input<typeof createReminderSchema>;
