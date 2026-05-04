import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "data", "inquiries.json");

function ensureFile() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "[]");
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    if (!token) return NextResponse.json({ success: false }, { status: 401 });
    ensureFile();
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    ensureFile();
    const body = await req.json();
    const inquiries = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    const newInquiry = {
      id: Date.now().toString(),
      ...body,
      status: "New",
      createdAt: new Date().toISOString(),
    };
    inquiries.unshift(newInquiry);
    fs.writeFileSync(DB_FILE, JSON.stringify(inquiries, null, 2));
    return NextResponse.json({ success: true, data: newInquiry });
  } catch (error) {
    console.error("Inquiry save error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    ensureFile();
    const { id, status } = await req.json();
    const inquiries = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    const updated = inquiries.map((inq: { id: string }) =>
      inq.id === id ? { ...inq, status } : inq
    );
    fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
