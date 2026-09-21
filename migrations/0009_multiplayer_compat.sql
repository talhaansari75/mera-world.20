create table if not exists multiplayer_rooms (
  room_id text primary key,
  host_user_id text not null references "user" ("id") on delete cascade,
  mode text not null default 'classic',
  status text not null default 'open',
  max_players integer not null default 4,
  state_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists multiplayer_rooms_status_updated_idx
  on multiplayer_rooms (status, updated_at desc);

create table if not exists multiplayer_members (
  room_id text not null references multiplayer_rooms (room_id) on delete cascade,
  user_id text not null references "user" ("id") on delete cascade,
  display_name text not null default 'Traveler',
  role text not null default 'player',
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create index if not exists multiplayer_members_presence_idx
  on multiplayer_members (room_id, last_seen_at desc);
