import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  description: z.string().max(1000).optional(),
  kind: z.enum(["event", "news", "salon"]).default("event"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().max(100).optional(),
  startsAt: z.string().datetime().or(z.string().min(4)),
  endsAt: z.string().datetime().optional().or(z.literal("")),
  status: z.enum(["upcoming", "completed", "cancelled"]).default("upcoming"),
});

export const updateEventSchema = createEventSchema.partial();
