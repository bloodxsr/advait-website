import { z } from "zod";

export const createSocialPostSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  caption: z.string().max(2000).optional(),
  type: z.enum(["photo", "gallery", "news"]),
  imageUrls: z.array(z.string().url("Must be a valid image URL")).min(1, "At least one image URL is required"),
  divisionId: z.string().uuid().optional(),
});

export const updateSocialPostSchema = createSocialPostSchema.partial();
