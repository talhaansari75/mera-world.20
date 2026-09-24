-- Cloud save safety snapshots. Every overwrite keeps the previous player save.
create table if not exists player_save_backups (
  id bigserial primary key,
  user_id text not null references "user"(id) on delete cascade,
  revision bigint not null,
  save_json text not null,
  created_at timestamptz not null default now()
);
create index if not exists player_save_backups_user_created_idx on player_save_backups(user_id, created_at desc);
