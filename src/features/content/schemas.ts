import { z } from "zod";

export const contentPlatformSchema = z.enum(["TIKTOK", "INSTAGRAM"]);
export const contentStatusSchema = z.enum([
  "IDEA",
  "SCRIPT",
  "FILMING",
  "EDITING",
  "POSTED",
]);

export const upsertContentPostSchema = z.object({
  id: z.string().uuid().optional(),
  platform: contentPlatformSchema.default("TIKTOK"),
  status: contentStatusSchema.default("IDEA"),
  title: z.string().min(1),
  idea: z.string().optional().or(z.literal("")),
  caption: z.string().optional().or(z.literal("")),
  scheduledAt: z.string().optional().or(z.literal("")),
  postedAt: z.string().optional().or(z.literal("")),
});

export type UpsertContentPostInput = z.input<typeof upsertContentPostSchema>;

