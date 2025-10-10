import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const raw = process.env.DATABASE_URL ?? null;
  let parsed: Record<string, any> | null = null;

  if (raw) {
    try {
      const u = new URL(raw);
      parsed = {
        protocol: u.protocol,        // should be "postgresql:"
        host: u.hostname,            // e.g. db.abcd.supabase.co
        port: u.port,                // "5432"
        database: u.pathname.replace(/^\//, ""), // postgres
        hasSSLQuery: u.search.includes("sslmode=") || u.search.includes("ssl="),
      };
    } catch (e: any) {
      parsed = { error: e.message };
    }
  }

  return NextResponse.json({
    present: !!raw,
    length: raw?.length ?? 0,
    parsed,
    vercelEnv: process.env.VERCEL_ENV, // "production" | "preview" | "development"
    nodeEnv: process.env.NODE_ENV,
  });
}
