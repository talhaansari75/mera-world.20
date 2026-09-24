create table if not exists player_profile (
  player_number bigint generated always as identity primary key,
  user_id text not null unique references "user" ("id") on delete cascade,
  username text,
  created_at timestamptz not null default now()
);

create table if not exists player_presence (
  user_id text primary key references "user" ("id") on delete cascade,
  last_seen_at timestamptz not null default now(),
  total_play_seconds integer not null default 0,
  current_screen text
);

create index if not exists player_presence_last_seen_idx
  on player_presence (last_seen_at desc);

create table if not exists player_activity (
  id bigint generated always as identity primary key,
  user_id text not null references "user" ("id") on delete cascade,
  event_type text not null,
  screen text,
  occurred_at timestamptz not null default now(),
  duration_seconds integer not null default 0
);

create index if not exists player_activity_user_time_idx
  on player_activity (user_id, occurred_at desc);

create index if not exists player_activity_time_idx
  on player_activity (occurred_at desc);
