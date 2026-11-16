import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { loginSchema } from "@/lib/validators/auth";
import { createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { checkRateLimit, clearRateLimit, recordFailedAttempt } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientKey = forwardedFor?.split(",")[0]?.trim() || "unknown";
    const rateLimit = await checkRateLimit(`login:${clientKey}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, role } = result.data;

    // Fetch user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    // Uniform error message for security (prevent email enumeration)
    const invalidCredentialsError = "Invalid email or password";

    if (!user) {
      await recordFailedAttempt(`login:${clientKey}`);
      return NextResponse.json({ error: invalidCredentialsError }, { status: 401 });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      await recordFailedAttempt(`login:${clientKey}`);
      return NextResponse.json({ error: invalidCredentialsError }, { status: 401 });
    }

    // Enforce role requirement when admin login is selected
    if (role === "admin" && user.role !== "admin") {
      await recordFailedAttempt(`login:${clientKey}`);
      return NextResponse.json(
        { error: "Access denied: this account does not possess administrative privileges" },
        { status: 403 }
      );
    }

    await clearRateLimit(`login:${clientKey}`);

    // Create session token
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "user" | "admin",
    });

    const response = NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        avatarUrl: user.avatarUrl,
      },
    });

    // Set secure HTTP-only session cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Set UI sync cookies (readable by client components)
    response.cookies.set("advait_session_active", "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
    response.cookies.set("advait_name", encodeURIComponent(user.name), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
    response.cookies.set("advait_role", user.role, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
