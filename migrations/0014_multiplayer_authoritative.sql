alter table multiplayer_members add column if not exists found_words jsonb not null default '[]'::jsonb;
alter table multiplayer_matches add column if not exists level_id integer not null default 1;
alter table multiplayer_matches add column if not exists settled_at timestamptz;
alter table multiplayer_matches add column if not exists event_version integer not null default 0;
create index if not exists multiplayer_matches_room_status_idx on multiplayer_matches(room_id,status);
