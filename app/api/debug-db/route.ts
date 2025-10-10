import { NextResponse } from "next/server";
import { query } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const headers = {
    "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
    "pragma": "no-cache",
  };
  try {
    const meta = await query<any>(`
      select current_user, current_database(), inet_server_addr()::text as host;
    `);
    const cnt = await query<{ c: number }>(`select count(*)::int as c from public.matches;`);
    const sample = await query<any>(`
      select id, league, home_team, away_team, kickoff
      from public.matches
      order by id desc
      limit 5;
    `);

    const envDbHost = process.env.DATABASE_URL
      ? process.env.DATABASE_URL.split("@").pop()?.split("?")[0]
      : null;

    return new NextResponse(
      JSON.stringify({
        env_db_target: envDbHost,
        meta: meta.rows[0],
        matches_count: cnt.rows[0]?.c ?? 0,
        sample: sample.rows,
      }),
      { headers }
    );
  } catch (e:any){
    return new NextResponse(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
