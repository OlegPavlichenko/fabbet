# FabBet MVP — Web + Telegram

Minimal web app (Next.js 14 + Tailwind) with a Telegram bot (grammy) using the same Vercel deployment.

## 1) Setup

```bash
pnpm i        # or npm i / yarn
cp .env.example .env
# fill DATABASE_URL, TELEGRAM_* and BASE URLs
```

## 2) Database

Use any Postgres (Supabase recommended). Run `lib/schema.sql` in your DB.

Optional seed to see UI quickly:
```sql
insert into public.matches (league, home_team, away_team, kickoff, odds_home, odds_draw, odds_away) values
('KPL', 'Dordoi', 'Alga', now() + interval '3 hours', 1.9, 3.2, 4.1),
('UCL', 'Real Madrid', 'Man City', now() + interval '26 hours', 2.4, 3.3, 2.8),
('EPL', 'Arsenal', 'Chelsea', now() + interval '50 hours', 2.0, 3.5, 3.7);
```

## 3) Vercel

- Import this repo
- Add ENV vars: `DATABASE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_NAME`, `APP_BASE_URL`, `NEXT_PUBLIC_BASE_URL`
- Deploy
- Check `/api/health`

## 4) Telegram webhook

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook"   -d url="$APP_BASE_URL/api/telegram?secret=$TELEGRAM_WEBHOOK_SECRET"
```

## 5) Local dev

```bash
pnpm dev
# open http://localhost:3000
```

## 6) Notes

- Route Handlers are forced to Node runtime.
- Bot and web share the same DB.
- Replace the naive predictor in `lib/predict.ts` with your model later.
