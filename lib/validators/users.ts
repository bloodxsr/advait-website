import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  headline: z.string().max(200).optional(),
  bio: z.string().max(1000).optional(),
  year: z.string().optional(),
  section: z.string().optional(),
  department: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  techStack: z.array(z.string()).optional(),
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
});

export const profileSectionSchema = z.object({
  type: z.enum(["about", "projects", "research", "certificates", "blog"]),
  title: z.string().min(1).max(100),
  content: z.any(), // JSON structured data
  position: z.number().int().default(0),
  visible: z.boolean().default(true),
});
