-- Users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  telegram_id text unique,
  nickname text,
  created_at timestamptz default now()
);
-- Matches
create table if not exists public.matches (
  id bigserial primary key,
  league text not null,
  home_team text not null,
  away_team text not null,
  kickoff timestamptz not null,
  odds_home numeric,
  odds_draw numeric,
  odds_away numeric
);
-- Predictions
create table if not exists public.predictions (
  id bigserial primary key,
  user_id uuid references public.users(id) on delete cascade,
  match_id bigint references public.matches(id) on delete cascade,
  pick text check (pick in ('HOME','DRAW','AWAY')),
  confidence numeric check (confidence between 0 and 1),
  created_at timestamptz default now(),
  unique(user_id, match_id)
);
