alter table blockchain_payment_intents add column if not exists payer_address text;
create index if not exists blockchain_payment_intents_payer_idx on blockchain_payment_intents(payer_address,status);