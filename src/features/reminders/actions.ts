"use server";

import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/activity";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { completeReminderSchema, createReminderSchema } from "@/features/reminders/schemas";

const parseDateTimeLocal = (v: string) => {
  const s = v.trim();
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d;
  const t = new Date(`${s}:00`);
  if (!Number.isNaN(t.getTime())) return t;
  throw new Error("Invalid date");
};

export async function createReminderAction(raw: unknown) {
  const input = createReminderSchema.parse(raw);
  const { user } = await requireAuth();

  const reminder = await prisma.reminder.create({
    data: {
      userId: user.id,
      customerId: input.customerId,
      dueAt: parseDateTimeLocal(input.dueAt),
      note: input.note || null,
    },
  });

  await logActivity({
    userId: user.id,
    action: "reminder.created",
    entityType: "Reminder",
    entityId: reminder.id,
    metadata: { customerId: input.customerId },
  });

  revalidatePath(`/customers/${input.customerId}`);
  return { ok: true as const, id: reminder.id };
}

export async function completeReminderAction(raw: unknown) {
  const input = completeReminderSchema.parse(raw);
  const { user } = await requireAuth();

  await prisma.reminder.updateMany({
    where: { id: input.id, userId: user.id, customerId: input.customerId },
    data: { completedAt: new Date() },
  });

  await logActivity({
    userId: user.id,
    action: "reminder.completed",
    entityType: "Reminder",
    entityId: input.id,
    metadata: { customerId: input.customerId },
  });

  revalidatePath(`/customers/${input.customerId}`);
  return { ok: true as const };
}

export async function deleteReminderAction(input: { id: string; customerId: string }) {
  const { user } = await requireAuth();
  await prisma.reminder.deleteMany({
    where: { id: input.id, userId: user.id, customerId: input.customerId },
  });

  await logActivity({
    userId: user.id,
    action: "reminder.deleted",
    entityType: "Reminder",
    entityId: input.id,
    metadata: { customerId: input.customerId },
  });

  revalidatePath(`/customers/${input.customerId}`);
  return { ok: true as const };
}

