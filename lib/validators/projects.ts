import { z } from "zod";
import { httpUrlSchema } from "./url";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters").max(100),
  description: z.string().max(1000).optional(),
  type: z.enum(["open_source", "individual", "group"]),
  link: httpUrlSchema,
  subtopicId: z.string().uuid().optional(),
  divisionId: z.string().uuid().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
