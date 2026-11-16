import { z } from "zod";

export const createResourceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().max(800).optional(),
  link: z.string().url("Must be a valid URL"),
  category: z.string().default("General"),
  tags: z.array(z.string()).default([]),
});

export const reviewResourceSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  note: z.string().max(500).optional(),
});
