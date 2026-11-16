import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { divisions, users } from "@/db/schema";
import { registerSchema } from "@/lib/validators/auth";
import { createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      github,
      divisionSlug,
      intentNote,
      department,
      year,
      section,
      divisionId,
    } = result.data;

    // Check existing email
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    let resolvedDivisionId = divisionId;
    if (!resolvedDivisionId && divisionSlug) {
      const [division] = await db
        .select({ id: divisions.id })
        .from(divisions)
        .where(eq(divisions.slug, divisionSlug))
        .limit(1);
      resolvedDivisionId = division?.id;
    }

    // Hash password & insert user (role is strictly 'user')
    const passwordHash = await bcrypt.hash(password, 10);
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: "user",
        github: github || null,
        bio: intentNote || null,
        department: department || null,
        year: year || null,
        section: section || null,
        divisionId: resolvedDivisionId || null,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    // Create JWT session
    const token = await createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: "user",
    });

    const response = NextResponse.json({ user: newUser }, { status: 201 });

    // Set HTTP-only session cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Set UI helper cookies
    response.cookies.set("advait_name", encodeURIComponent(newUser.name), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
    response.cookies.set("advait_session_active", "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
    response.cookies.set("advait_role", "user", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
