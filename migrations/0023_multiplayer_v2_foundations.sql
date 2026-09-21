-- Multiplayer V2: replay protection, anti-cheat telemetry and rating/season foundations.

create table if not exists multiplayer_action_receipts (
  id uuid primary key,
  match_id text not null references multiplayer_matches(match_id) on delete cascade,
  user_id text not null,
  client_action_id text not null,
  action_type text not null,
  created_at timestamptz not null default now(),
  unique(match_id, user_id, client_action_id)
);
create index if not exists multiplayer_action_receipts_match_created_idx
  on multiplayer_action_receipts(match_id, created_at desc);

create table if not exists multiplayer_anti_cheat_flags (
  id uuid primary key,
  match_id text not null references multiplayer_matches(match_id) on delete cascade,
  user_id text not null,
  flag_type text not null,
  severity text not null check (severity in ('low','medium','high')),
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index if not exists multiplayer_anti_cheat_match_user_idx
  on multiplayer_anti_cheat_flags(match_id, user_id, created_at desc);

create table if not exists multiplayer_rating_history (
  id uuid primary key,
  user_id text not null,
  match_id text references multiplayer_matches(match_id) on delete set null,
  rating_before integer not null,
  rating_delta integer not null,
  rating_after integer not null,
  created_at timestamptz not null default now()
);
create index if not exists multiplayer_rating_history_user_created_idx
  on multiplayer_rating_history(user_id, created_at desc);

create table if not exists multiplayer_seasons (
  id uuid primary key,
  season_key text not null unique,
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null check (status in ('scheduled','active','finished')),
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index if not exists multiplayer_seasons_status_idx
  on multiplayer_seasons(status, starts_at, ends_at);

create table if not exists multiplayer_season_scores (
  season_id uuid not null references multiplayer_seasons(id) on delete cascade,
  user_id text not null,
  rating integer not null default 0,
  wins integer not null default 0,
  games integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (season_id, user_id)
);
create index if not exists multiplayer_season_scores_rank_idx
  on multiplayer_season_scores(season_id, rating desc, wins desc);
