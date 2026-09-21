-- Base blockchain payments (USDC) for Mera World.
create table if not exists blockchain_payment_intents (
  id uuid primary key,
  user_id text not null references "user"(id) on delete restrict,
  product_id text not null,
  chain_id integer not null,
  token_address text not null,
  recipient_address text not null,
  amount_atomic numeric(78,0) not null check (amount_atomic > 0),
  status text not null default 'pending' check (status in ('pending','paid','failed','expired')),
  tx_hash text unique,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  expires_at timestamptz not null
);
create index if not exists blockchain_payment_intents_user_idx on blockchain_payment_intents(user_id, created_at desc);
create index if not exists blockchain_payment_intents_status_idx on blockchain_payment_intents(status, created_at desc);
create table if not exists blockchain_wallets (
  user_id text not null references "user"(id) on delete cascade,
  chain_id integer not null,
  address text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key(user_id, chain_id)
);
alter table purchase_receipts add column if not exists chain_id integer;
alter table purchase_receipts add column if not exists tx_hash text;
create unique index if not exists purchase_receipts_tx_hash_uq on purchase_receipts(tx_hash) where tx_hash is not null;
