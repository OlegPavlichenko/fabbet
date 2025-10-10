import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Кто мы и куда подключены
    const meta = await query<{
      current_user: string;
      current_database: string;
      host: string | null;
    }>(`
      select current_user, current_database(), inet_server_addr()::text as host;
    `);

    // Сколько матчей в таблице
    const cnt = await query<{ c: number }>(`select count(*)::int as c from public.matches;`);

    // Покажем 5 последних
    const sample = await query<any>(`
      select id, league, home_team, away_team, kickoff
      from public.matches
      order by id desc
      limit 5;
    `);

    // Немного полезной инфы из ENV (без пароля)
    const envDbHost = process.env.DATABASE_URL
      ? process.env.DATABASE_URL.split("@").pop()?.split("?")[0]
      : null;

    return NextResponse.json({
      env_db_target: envDbHost,  // хост/база из ENV
      meta: meta.rows[0],        // фактический пользователь/база/хост
      matches_count: cnt.rows[0]?.c ?? 0,
      sample: sample.rows,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
