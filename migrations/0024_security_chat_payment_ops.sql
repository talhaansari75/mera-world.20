-- Security/operations hardening for multiplayer chat and blockchain payments.
alter table if exists blockchain_payment_intents
  add column if not exists idempotency_key text;

create unique index if not exists blockchain_payment_intents_user_idempotency_uq
  on blockchain_payment_intents(user_id, idempotency_key)
  where idempotency_key is not null;

create index if not exists blockchain_payment_intents_tx_hash_idx
  on blockchain_payment_intents(tx_hash)
  where tx_hash is not null;

create index if not exists blockchain_payment_intents_expiry_idx
  on blockchain_payment_intents(status, expires_at);

create index if not exists multiplayer_action_receipts_created_idx
  on multiplayer_action_receipts(created_at);

create table if not exists multiplayer_chat_reports (
  id uuid primary key,
  room_id text not null references multiplayer_rooms(room_id) on delete cascade,
  reporter_user_id text not null,
  target_user_id text not null,
  message_id text,
  reason text not null check (reason in ('spam','abuse','harassment','scam','other')),
  details text,
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists multiplayer_chat_reports_status_created_idx
  on multiplayer_chat_reports(status, created_at desc);

create table if not exists multiplayer_chat_blocks (
  user_id text not null,
  blocked_user_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, blocked_user_id),
  check (user_id <> blocked_user_id)
);

create index if not exists multiplayer_chat_blocks_blocked_idx
  on multiplayer_chat_blocks(blocked_user_id, created_at desc);
