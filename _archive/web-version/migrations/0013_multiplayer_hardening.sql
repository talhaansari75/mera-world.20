do $$ begin
if exists (select 1 from pg_constraint where conname='multiplayer_members_user_id_fkey') then alter table multiplayer_members drop constraint multiplayer_members_user_id_fkey; end if;
end $$;
alter table multiplayer_members add column if not exists bot_skill text;
alter table multiplayer_members add column if not exists progress integer not null default 0;
alter table multiplayer_members add column if not exists combo integer not null default 0;
alter table multiplayer_members add column if not exists disconnected_at timestamptz;
alter table multiplayer_matches add column if not exists world_id integer;
alter table multiplayer_matches add column if not exists duration_seconds integer not null default 180;
create index if not exists multiplayer_matches_status_idx on multiplayer_matches(status,created_at desc);
create index if not exists multiplayer_members_progress_idx on multiplayer_members(room_id,progress desc);