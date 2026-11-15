import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Only internal member / club operation routes require authentication.
// Projects, Hall of Flames, Leaderboard, Events, Resources, Team, and Social are open to everyone.
const protectedRoutes = [
  "/dashboard",
  "/admin",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isProtected) {
    const session = request.cookies.get("advait_session")?.value;

    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("locked", "true");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
