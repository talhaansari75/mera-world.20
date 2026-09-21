alter table multiplayer_matches add column if not exists winner_user_id text;
create table if not exists multiplayer_match_results (
  match_id uuid not null references multiplayer_matches(match_id) on delete cascade,
  user_id text not null,
  rank integer not null,
  score integer not null default 0,
  is_bot boolean not null default false,
  created_at timestamptz not null default now(),
  primary key(match_id,user_id)
);
create index if not exists multiplayer_results_user_idx on multiplayer_match_results(user_id,created_at desc);