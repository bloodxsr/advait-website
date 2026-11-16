import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const authSecret = process.env.AUTH_SECRET;

if (!authSecret) {
  throw new Error("AUTH_SECRET must be configured");
}

const SECRET_KEY = new TextEncoder().encode(authSecret);

export const COOKIE_NAME = "advait_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

const sessionPayloadSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["user", "admin"]),
});

/**
 * Creates an encrypted JWT session token valid for 7 days
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

/**
 * Verifies a JWT session token and returns payload or null
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const result = sessionPayloadSchema.safeParse(payload);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/**
 * Retrieves the current session from request cookies (Server Components / Route Handlers)
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

/**
 * Enforces authenticated user; returns session or throws 401
 */
export async function requireUser(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Enforces specific role (e.g. 'admin'); returns session or throws 403
 */
export async function requireRole(role: "user" | "admin"): Promise<SessionPayload> {
  const session = await requireUser();
  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user || (role === "admin" && user.role !== "admin") || (role === "user" && user.role !== "user")) {
    throw new Error("FORBIDDEN");
  }

  return { ...session, role: user.role as "user" | "admin" };
}
