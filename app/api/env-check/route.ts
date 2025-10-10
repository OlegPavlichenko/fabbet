import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const headers = {
    "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
    "pragma": "no-cache",
  };

  const raw = process.env.DATABASE_URL ?? "";
  const hasAtHost = (raw.includes("@db.") && raw.includes(".supabase.co")) || false;

  let parsed: any = null;
  let safeSample: string | null = null;

  if (raw) {
    safeSample = raw.length <= 20 ? raw : `${raw.slice(0, 10)}...${raw.slice(-10)}`;
    try {
      const u = new URL(raw);
      parsed = {
        protocol: u.protocol,
        host: u.hostname,
        port: u.port,
        database: u.pathname.replace(/^\//, ""),
        hasSSLQuery: u.search.includes("sslmode=") || u.search.includes("ssl="),
      };
    } catch (e: any) {
      parsed = { error: e.message };
    }
  }

  return new NextResponse(
    JSON.stringify({
      present: !!raw,
      length: raw.length,
      sample: safeSample,
      hasAtHost,             // ← видно, попал ли блок "@db....supabase.co"
      parsed,
      vercelEnv: process.env.VERCEL_ENV,
      nodeEnv: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL,
      gitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    }),
    { headers }
  );
}
