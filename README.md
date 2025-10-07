# FabBet MVP — Web + Telegram (fixed)

- Removed Server Actions in UI (client-side fetch instead) to simplify Vercel build.
- Added `next.config.ts` with `experimental.serverActions` enabled (safe default).
- Forced Node.js runtime in API routes.

## Setup
- Import to Vercel, add ENV vars (`DATABASE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_NAME`, `APP_BASE_URL`, `NEXT_PUBLIC_BASE_URL`).
- Run SQL in `lib/schema.sql` on your Postgres (Supabase recommended).
- Optional seed matches (see previous README).

## Webhook
```
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook"   -d url="$APP_BASE_URL/api/telegram?secret=$TELEGRAM_WEBHOOK_SECRET"
```
