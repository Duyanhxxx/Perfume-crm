import "server-only";

import { prisma } from "@/lib/prisma";

type JsonValue =
  | string
  | number
  | boolean
  | { [key: string]: JsonValue }
  | JsonValue[];

export async function logActivity(input: {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: JsonValue;
}) {
  await prisma.activityLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      ...(input.metadata ? { metadata: input.metadata } : {}),
    },
  });
}
