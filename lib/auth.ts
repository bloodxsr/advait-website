import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "advait_collective_auth_secret_2026_x7k9m2p4q8r1"
);

export const COOKIE_NAME = "advait_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

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
    return payload as unknown as SessionPayload;
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
  if (role === "admin" && session.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return session;
}
