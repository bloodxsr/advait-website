import { NextResponse } from "next/server";
import { getSocialLinks } from "@/lib/services/socials";

export const revalidate = 60;

export async function GET() {
  try {
    const data = await getSocialLinks();
    return NextResponse.json({ socialLinks: data });
  } catch (err: any) {
    console.error("Get social links error:", err);
    return NextResponse.json({ error: "Failed to fetch social links" }, { status: 500 });
  }
}
