import { NextResponse } from "next/server";
import { supabase } from "@/lib/db"; // ← используем supabase-клиент

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const headers = {
    "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
    "pragma": "no-cache",
  };

  try {
    // count(*) по matches
    const { count, error: countErr } = await supabase
      .from("matches")
      .select("*", { count: "exact", head: true });

    if (countErr) {
      throw new Error(`count error: ${countErr.message}`);
    }

    // 5 последних матчей
    const { data: sample, error: sampleErr } = await supabase
      .from("matches")
      .select("id, league, home_team, away_team, kickoff")
      .order("id", { ascending: false })
      .limit(5);

    if (sampleErr) {
      throw new Error(`sample error: ${sampleErr.message}`);
    }

    // показать, что именно в ENV (без секрета)
    const envDbHost = process.env.DATABASE_URL
      ? process.env.DATABASE_URL.split("@").pop()?.split("?")[0]
      : null;

    return new NextResponse(
      JSON.stringify({
        env_db_target: envDbHost,
        matches_count: count ?? 0,
        sample: sample ?? [],
      }),
      { headers }
    );
  } catch (e: any) {
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: 500,
      headers,
    });
  }
}
