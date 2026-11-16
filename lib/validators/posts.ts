import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  excerpt: z.string().max(400).optional(),
  bodyMd: z.string().min(10, "Post body must be at least 10 characters"),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  subtopicId: z.string().uuid().optional(),
  readTime: z.string().optional(),
});

export const updatePostSchema = createPostSchema.partial();
