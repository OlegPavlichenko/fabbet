import { NextResponse } from "next/server";
import { query } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(){
  const { rows } = await query(`
    select id, league, home_team, away_team, kickoff, odds_home, odds_draw, odds_away
    from public.matches
    order by kickoff asc
    limit 50;
  `);
  return NextResponse.json({ matches: rows });
}
