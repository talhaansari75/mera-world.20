-- Mera Word Search Journey — game persistence (cloud save, sessions, rewards, liveops).
-- Auth identity tables live in 0001_auth.sql.

create table if not exists player_saves (
  user_id    text primary key references "user"(id) on delete cascade,
  save_json  text not null,
  version    integer not null default 1 check (version >= 1),
  revision   bigint not null default 1 check (revision >= 1),
  updated_at timestamptz not null default now()
);

create table if not exists leaderboard_scores (
  id           serial primary key,
  user_id      text not null references "user"(id) on delete cascade,
  display_name text not null,
  board        text not null,
  score        integer not null check (score >= 0),
  meta_json    text,
  created_at   timestamptz not null default now()
);
create index if not exists leaderboard_board_score_idx
  on leaderboard_scores (board, score desc, created_at asc);
create index if not exists leaderboard_user_board_idx
  on leaderboard_scores (user_id, board);

create table if not exists daily_results (
  user_id      text not null references "user"(id) on delete cascade,
  day_key      text not null,
  score        integer not null,
  time_ms      integer not null,
  stars        integer not null default 0 check (stars between 0 and 3),
  display_name text not null,
  created_at   timestamptz not null default now(),
  primary key (user_id, day_key)
);
create index if not exists daily_results_day_score_idx
  on daily_results (day_key, score desc, time_ms asc);

create table if not exists idempotency_keys (
  user_id text not null references "user"(id) on delete cascade,
  key text not null,
  operation text not null,
  response_json jsonb not null,
  status text not null default 'pending' check (status in ('pending','completed')),
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, key)
);
create index if not exists idempotency_created_idx on idempotency_keys(created_at);

create table if not exists rate_limit_buckets (
  subject text not null,
  bucket text not null,
  count integer not null default 0,
  reset_at timestamptz not null,
  primary key(subject, bucket)
);

create table if not exists audit_events (
  id bigserial primary key,
  user_id text references "user"(id) on delete set null,
  event_type text not null,
  payload_json jsonb not null default '{}',
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists audit_user_created_idx on audit_events(user_id, created_at desc);
create index if not exists audit_type_created_idx on audit_events(event_type, created_at desc);

create table if not exists gameplay_events (
  id bigserial primary key,
  user_id text references "user"(id) on delete set null,
  session_id text,
  event_type text not null,
  payload_json jsonb not null default '{}',
  client_ts bigint,
  created_at timestamptz not null default now()
);
create index if not exists gameplay_user_created_idx on gameplay_events(user_id, created_at desc);
create index if not exists gameplay_type_created_idx on gameplay_events(event_type, created_at desc);

create table if not exists multiplayer_rooms (
  room_id text primary key,
  host_user_id text not null references "user"(id) on delete cascade,
  mode text not null,
  state_json jsonb not null default '{}',
  status text not null default 'open' check (status in ('open','playing','closed')),
  max_players integer not null default 4 check (max_players between 2 and 16),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists multiplayer_status_idx on multiplayer_rooms(status, updated_at desc);

create table if not exists multiplayer_members (
  room_id text not null references multiplayer_rooms(room_id) on delete cascade,
  user_id text not null references "user"(id) on delete cascade,
  display_name text not null,
  role text not null default 'player' check (role in ('host','player')),
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key(room_id, user_id)
);

create table if not exists moderation_reports (
  id bigserial primary key,
  reporter_user_id text not null references "user"(id) on delete cascade,
  target_type text not null,
  target_id text not null,
  reason text not null,
  details text not null default '',
  status text not null default 'open' check (status in ('open','reviewing','resolved','rejected')),
  created_at timestamptz not null default now()
);
create index if not exists moderation_status_idx on moderation_reports(status, created_at desc);
create index if not exists moderation_reporter_idx on moderation_reports(reporter_user_id);

create table if not exists purchase_receipts (
  id bigserial primary key,
  user_id text not null references "user"(id) on delete restrict,
  provider text not null,
  external_id text not null,
  product_id text not null,
  amount_minor integer not null check (amount_minor >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'pending' check (status in ('pending','verified','failed','refunded')),
  raw_json jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(provider, external_id)
);
create index if not exists purchase_user_idx on purchase_receipts(user_id, created_at desc);

create table if not exists game_sessions_v5 (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  level_id integer not null,
  seed text not null,
  status text not null,
  score integer not null default 0,
  started_at bigint not null,
  updated_at bigint not null,
  state_json jsonb not null default '{}'
);
create index if not exists idx_game_sessions_v5_user on game_sessions_v5(user_id, updated_at desc);
create unique index if not exists game_sessions_v5_one_open_boss_per_user_level
  on game_sessions_v5 (user_id, level_id)
  where status = 'boss_open';

create table if not exists reward_ledger_v5 (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  idempotency_key text not null unique,
  payload_json jsonb not null,
  created_at bigint not null
);
create index if not exists reward_ledger_v5_user_idx on reward_ledger_v5(user_id, created_at desc);

create table if not exists analytics_events_v5 (
  id text primary key,
  user_id text references "user"(id) on delete set null,
  session_id text,
  name text not null,
  properties_json jsonb not null default '{}',
  created_at bigint not null
);
create index if not exists idx_analytics_v5_name_time on analytics_events_v5(name, created_at desc);
create index if not exists analytics_v5_user_time_idx on analytics_events_v5(user_id, created_at desc);

create table if not exists multiplayer_rooms_v5 (
  id text primary key,
  mode text not null,
  status text not null,
  version integer not null default 0,
  state_json jsonb not null default '{}',
  created_at bigint not null,
  updated_at bigint not null
);

create table if not exists payment_events_v5 (
  event_id text primary key,
  event_type text not null,
  payload_json jsonb not null,
  processed_at bigint not null
);

create table if not exists audit_events_v5 (
  id text primary key,
  actor_id text not null,
  action text not null,
  target text,
  metadata_json jsonb not null default '{}',
  created_at bigint not null
);

create table if not exists moderation_cases_v5 (
  id text primary key,
  reporter_id text,
  target_id text not null,
  reason text not null,
  status text not null,
  created_at bigint not null,
  updated_at bigint not null
);

create table if not exists entitlements (
  user_id text not null references "user"(id) on delete restrict,
  product_id text not null,
  active boolean not null default true,
  source text not null default 'purchase' check (source in ('purchase','grant','refund','migration','promo')),
  updated_at timestamptz not null default now(),
  expires_at timestamptz,
  primary key(user_id, product_id)
);
create index if not exists entitlements_user_idx on entitlements(user_id, active);
create index if not exists entitlements_active_expiry_idx on entitlements (active, expires_at);

create table if not exists admin_audit_notes (
  id bigserial primary key,
  admin_user_id text not null references "user"(id) on delete cascade,
  action text not null,
  target text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists admin_audit_created_idx on admin_audit_notes(created_at desc);
create index if not exists admin_audit_user_created_idx on admin_audit_notes(admin_user_id, created_at desc);

create table if not exists creator_puzzles (
  id text primary key,
  user_id text not null references "user"(id) on delete cascade,
  title text not null,
  category text not null,
  words_json jsonb not null,
  status text not null default 'published' check (status in ('draft','pending_review','approved','published','rejected','archived')),
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists creator_puzzles_user_updated_idx on creator_puzzles(user_id, updated_at desc);

create table if not exists creator_reviews (
  id text primary key,
  puzzle_id text not null references creator_puzzles(id) on delete cascade,
  user_id text not null references "user"(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  body text not null default '',
  created_at timestamptz not null default now(),
  unique(puzzle_id, user_id)
);
create index if not exists creator_reviews_puzzle_idx on creator_reviews(puzzle_id, created_at desc);

create table if not exists push_subscriptions (
  user_id text not null references "user"(id) on delete cascade,
  endpoint text not null,
  subscription_json jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, endpoint)
);
create index if not exists push_subscriptions_user_idx on push_subscriptions(user_id);

create table if not exists creator_profiles (
  user_id text primary key references "user"(id) on delete cascade,
  display_name text not null,
  bio text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists roles (
  id text primary key,
  name text not null unique
);
create table if not exists user_roles (
  user_id text not null references "user"(id) on delete cascade,
  role_id text not null references roles(id) on delete cascade,
  primary key(user_id, role_id)
);
create table if not exists permissions (
  id text primary key,
  name text not null unique,
  description text not null default ''
);
create table if not exists role_permissions (
  role_id text not null references roles(id) on delete cascade,
  permission_id text not null references permissions(id) on delete cascade,
  primary key(role_id, permission_id)
);

insert into roles(id, name) values ('player','player'),('creator','creator'),('admin','admin')
on conflict (id) do nothing;
insert into permissions(id, name, description) values
  ('profile.read','profile.read','Read profile data'),
  ('profile.write','profile.write','Update own profile'),
  ('creator.publish','creator.publish','Publish creator content'),
  ('creator.moderate','creator.moderate','Moderate creator content'),
  ('multiplayer.host','multiplayer.host','Host multiplayer rooms'),
  ('admin.audit','admin.audit','Read/write privileged audit records')
on conflict (id) do nothing;
insert into role_permissions(role_id, permission_id)
select 'player', id from permissions where name in ('profile.read','profile.write','multiplayer.host')
on conflict do nothing;
insert into role_permissions(role_id, permission_id)
select 'creator', id from permissions where name in ('profile.read','profile.write','multiplayer.host','creator.publish')
on conflict do nothing;
insert into role_permissions(role_id, permission_id)
select 'admin', id from permissions
on conflict do nothing;

-- hashtext is built-in on Postgres; PGLite may omit it.
DO $$
BEGIN
  PERFORM hashtext('mera');
EXCEPTION WHEN undefined_function THEN
  CREATE FUNCTION hashtext(text) RETURNS integer LANGUAGE sql IMMUTABLE AS $f$
    SELECT ('x' || substr(md5($1), 1, 8))::bit(32)::int;
  $f$;
END $$;
