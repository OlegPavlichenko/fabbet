import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("matches")
    .select("id, league, home_team, away_team, kickoff, odds_home, odds_draw, odds_away")
    .order("kickoff", { ascending: true })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ matches: data ?? [] });
}
