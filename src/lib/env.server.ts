import "server-only";

import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1),
});

let cached: { DATABASE_URL: string } | undefined;

export function getServerEnv() {
  if (cached) return cached;
  cached = serverSchema.parse({ DATABASE_URL: process.env.DATABASE_URL });
  return cached;
}
