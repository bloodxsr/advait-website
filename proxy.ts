import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const authSecret = process.env.AUTH_SECRET;

if (!authSecret) {
  throw new Error("AUTH_SECRET must be configured");
}

const SECRET_KEY = new TextEncoder().encode(authSecret);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");
  const token = request.cookies.get("advait_session")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const role = payload.role;

    if (typeof payload.userId !== "string" || (role !== "user" && role !== "admin")) {
      throw new Error("Invalid session claims");
    }

    if (isAdmin && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("advait_session");
    response.cookies.delete("advait_session_active");
    response.cookies.delete("advait_name");
    response.cookies.delete("advait_role");
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
