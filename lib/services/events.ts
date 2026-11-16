import { db } from "@/lib/db";
import { events } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import type { z } from "zod";
import type { createEventSchema, updateEventSchema } from "@/lib/validators/events";

export async function getEvents(kind?: string) {
  const conditions = [];

  if (kind && kind !== "all") {
    conditions.push(eq(events.kind, kind));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return await db
    .select()
    .from(events)
    .where(whereClause)
    .orderBy(desc(events.startsAt));
}

export async function createEvent(input: z.infer<typeof createEventSchema>) {
  const [created] = await db
    .insert(events)
    .values({
      title: input.title,
      description: input.description || null,
      kind: input.kind,
      imageUrl: input.imageUrl || null,
      location: input.location || null,
      startsAt: new Date(input.startsAt),
      endsAt: input.endsAt ? new Date(input.endsAt) : null,
      status: input.status,
    })
    .returning();

  return created;
}

export async function updateEvent(id: string, input: z.infer<typeof updateEventSchema>) {
  const values: any = { ...input };
  if (input.startsAt) values.startsAt = new Date(input.startsAt);
  if (input.endsAt) values.endsAt = new Date(input.endsAt);

  const [updated] = await db
    .update(events)
    .set(values)
    .where(eq(events.id, id))
    .returning();

  return updated || null;
}

export async function deleteEvent(id: string) {
  const [deleted] = await db
    .delete(events)
    .where(eq(events.id, id))
    .returning();

  return deleted || null;
}
