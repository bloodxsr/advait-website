import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.delete(COOKIE_NAME);
  response.cookies.delete("advait_session_active");
  response.cookies.delete("advait_name");
  response.cookies.delete("advait_role");

  return response;
}
