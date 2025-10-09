import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(){
  try {
    const meta = await query<any>(`
      select current_user, current_database(), inet_server_addr()::text as host;
    `);
    const cnt = await query<any>(`select count(*)::int as c from public.matches;`);
    const sample = await query<any>(`
      select id, league, home_team, away_team, kickoff
      from public.matches
      order by id desc
      limit 5;
    `);
    return NextResponse.json({
      env_db_url: process.env.DATABASE_URL?.split('@').pop()?.split('?')[0], // хост:порт/база
      meta: meta.rows[0],
      matches_count: cnt.rows[0]?.c ?? 0,
      sample: sample.rows
    });
  } catch (e:any){
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
