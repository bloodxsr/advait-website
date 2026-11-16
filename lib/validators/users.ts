import { z } from "zod";
import { httpUrlSchema } from "./url";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  headline: z.string().max(200).optional(),
  bio: z.string().max(1000).optional(),
  year: z.string().optional(),
  section: z.string().optional(),
  department: z.string().optional(),
  avatarUrl: httpUrlSchema.optional().or(z.literal("")),
  techStack: z.array(z.string()).optional(),
  github: httpUrlSchema.optional().or(z.literal("")),
  linkedin: httpUrlSchema.optional().or(z.literal("")),
  portfolio: httpUrlSchema.optional().or(z.literal("")),
});

export const profileSectionSchema = z.object({
  type: z.enum(["about", "projects", "research", "certificates", "blog"]),
  title: z.string().min(1).max(100),
  content: z.any(), // JSON structured data
  position: z.number().int().default(0),
  visible: z.boolean().default(true),
});
