import { NextRequest } from "next/server";
import { Bot, webhookCallback } from "grammy";
import { query } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const token = process.env.TELEGRAM_BOT_TOKEN!;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET!; // used as path secret

const bot = new Bot(token);

bot.command("start", ctx => ctx.reply(
  "Привет! Я бот FabBet. Команды:\n/today — ближайшие матчи\n/pick <id> — прогноз по матчу"
));

bot.command("today", async (ctx) => {
  const { rows } = await query(`
    select id, league, home_team, away_team, to_char(kickoff,'YYYY-MM-DD HH24:MI') as ko
    from public.matches
    where kickoff >= now() - interval '2 hours'
    order by kickoff asc
    limit 10;
  `);
  if(rows.length===0) return ctx.reply("Матчей нет.");
  const lines = rows.map((r:any)=>`#${r.id}: ${r.league} — ${r.home_team} vs ${r.away_team} — ${r.ko}`);
  return ctx.reply(lines.join("\n"));
});

bot.command("pick", async (ctx) => {
  const parts = ctx.message?.text?.split(" ") ?? [];
  const id = Number(parts[1]);
  if(!id) return ctx.reply("Укажи id: /pick 123");
  const { rows } = await query(`select * from public.matches where id=$1`, [id]);
  if(!rows[0]) return ctx.reply("Матч не найден.");
  const m:any = rows[0];
  const best = Math.min(m.odds_home ?? 3, m.odds_draw ?? 3, m.odds_away ?? 3);
  let pick: "HOME"|"DRAW"|"AWAY" = "HOME";
  if(best === m.odds_draw) pick = "DRAW";
  else if(best === m.odds_away) pick = "AWAY";
  const conf = Math.max(0.4, Math.min(0.8, 1 / (best||3)));
  return ctx.reply(`Прогноз: ${pick} (уверенность ${(conf*100).toFixed(0)}%)`);
});

const handleUpdate = webhookCallback(bot, "std/http");

export async function POST(req: NextRequest){
  const url = new URL(req.url);
  if(url.searchParams.get("secret") !== secret){
    return new Response("Forbidden", { status: 403 });
  }
  const body = await req.json();
  return handleUpdate(new Request(req.url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" }
  }));
}
