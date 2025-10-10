import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const raw = process.env.DATABASE_URL ?? "";
  let host = "";
  try {
    host = new URL(raw).hostname;
  } catch { /* ignore */ }

  const bytes = Array.from(host).map(ch => ch.charCodeAt(0));
  return NextResponse.json({ host, bytes });
}
