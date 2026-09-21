-- Multiplayer social/voice hardening
create table if not exists multiplayer_voice_messages (
  id uuid primary key,
  room_id text not null references multiplayer_rooms(room_id) on delete cascade,
  user_id text not null,
  mime_type text not null,
  audio bytea not null,
  duration_ms integer not null check (duration_ms between 250 and 20000),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);
create index if not exists multiplayer_voice_room_created_idx on multiplayer_voice_messages(room_id, created_at desc);
create index if not exists multiplayer_voice_expiry_idx on multiplayer_voice_messages(expires_at);
