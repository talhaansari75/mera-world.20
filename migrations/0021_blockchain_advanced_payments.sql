create table if not exists blockchain_payment_refunds (
 id uuid primary key, intent_id uuid not null references blockchain_payment_intents(id) on delete restrict,
 user_id text not null references "user"(id) on delete restrict, amount_atomic numeric(78,0) not null check(amount_atomic>0),
 reason text not null, status text not null default 'requested' check(status in ('requested','approved','processing','refunded','rejected','failed')),
 refund_tx_hash text unique, requested_at timestamptz not null default now(), processed_at timestamptz, metadata jsonb not null default '{}'::jsonb
);
create unique index if not exists blockchain_payment_refund_intent_uq on blockchain_payment_refunds(intent_id) where status not in ('rejected','failed');
create table if not exists blockchain_payment_events (
 id bigserial primary key, intent_id uuid references blockchain_payment_intents(id) on delete restrict, chain_id integer not null,
 tx_hash text, block_number bigint, event_type text not null, event_key text not null unique, payload jsonb not null default '{}'::jsonb, observed_at timestamptz not null default now()
);
create index if not exists blockchain_payment_events_intent_idx on blockchain_payment_events(intent_id,observed_at desc);