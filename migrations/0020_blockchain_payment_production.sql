-- Production hardening for blockchain payments.
-- Safe on databases that already contain the columns/indexes.
alter table player_saves
  add column if not exists revision bigint not null default 1;

alter table blockchain_payment_intents
  add column if not exists block_number bigint,
  add column if not exists block_hash text,
  add column if not exists verified_at timestamptz,
  add column if not exists confirmations integer,
  add column if not exists failure_code text;

create unique index if not exists blockchain_payment_intents_tx_hash_uq
  on blockchain_payment_intents(tx_hash)
  where tx_hash is not null;

create unique index if not exists blockchain_currency_ledger_intent_uq
  on blockchain_currency_ledger(intent_id);

alter table blockchain_payment_intents
  drop constraint if exists blockchain_payment_intents_status_check;

alter table blockchain_payment_intents
  add constraint blockchain_payment_intents_status_check
  check (status in ('pending','paid','failed','expired'));

alter table blockchain_payment_intents
  drop constraint if exists blockchain_payment_intents_paid_consistency_check;

alter table blockchain_payment_intents
  add constraint blockchain_payment_intents_paid_consistency_check
  check (
    status <> 'paid'
    or (tx_hash is not null and paid_at is not null and verified_at is not null)
  );
