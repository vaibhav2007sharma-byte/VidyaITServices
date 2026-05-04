import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD || "Vidya@Admin2024";

  if (password === adminPassword) {
    const token = Buffer.from(`admin:${Date.now()}`).toString("base64");
    return NextResponse.json({ success: true, token });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
