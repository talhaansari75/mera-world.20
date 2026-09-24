alter table multiplayer_matches add column if not exists level_id integer not null default 1;
create table if not exists multiplayer_found_words(match_id uuid not null references multiplayer_matches(match_id) on delete cascade,user_id text not null,word text not null,created_at timestamptz not null default now(),primary key(match_id,user_id,word));
create index if not exists multiplayer_found_words_match_idx on multiplayer_found_words(match_id,user_id);
create table if not exists multiplayer_action_rate(user_id text not null,match_id uuid not null references multiplayer_matches(match_id) on delete cascade,window_started_at timestamptz not null default now(),count integer not null default 0,primary key(user_id,match_id));
