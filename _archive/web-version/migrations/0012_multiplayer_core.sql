create table if not exists multiplayer_matches (
 match_id uuid primary key, room_id text not null references multiplayer_rooms(room_id) on delete cascade,
 status text not null default 'waiting' check(status in ('waiting','countdown','live','finished','cancelled')),
 mode text not null default 'classic', puzzle_seed bigint not null default 0,
 started_at timestamptz, finished_at timestamptz, winner_user_id text, created_at timestamptz not null default now()
);
create table if not exists multiplayer_match_events (
 id bigserial primary key, match_id uuid not null references multiplayer_matches(match_id) on delete cascade,
 seq integer not null, user_id text not null, event_type text not null, payload jsonb not null default '{}',
 created_at timestamptz not null default now(), unique(match_id,seq)
);
create table if not exists multiplayer_ratings (
 user_id text primary key references "user"(id) on delete cascade, rating integer not null default 1000,
 wins integer not null default 0, losses integer not null default 0, draws integer not null default 0,
 games integer not null default 0, updated_at timestamptz not null default now()
);
create table if not exists multiplayer_friends (
 user_id text not null references "user"(id) on delete cascade, friend_user_id text not null references "user"(id) on delete cascade,
 status text not null default 'pending' check(status in ('pending','accepted','blocked')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), primary key(user_id,friend_user_id)
);
create table if not exists multiplayer_chat (
 id bigserial primary key, room_id text not null references multiplayer_rooms(room_id) on delete cascade,
 user_id text not null references "user"(id) on delete cascade, message text not null check(length(message) between 1 and 240),
 created_at timestamptz not null default now()
);
create index if not exists multiplayer_events_match_idx on multiplayer_match_events(match_id,seq);
create index if not exists multiplayer_chat_room_idx on multiplayer_chat(room_id,created_at);
create index if not exists multiplayer_rating_idx on multiplayer_ratings(rating desc);