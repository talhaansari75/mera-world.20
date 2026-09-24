create table if not exists legal_consents (
  user_id text not null references "user"(id) on delete cascade,
  version text not null,
  accepted_at timestamptz not null default now(),
  primary key (user_id, version)
);

create index if not exists legal_consents_user_idx
  on legal_consents(user_id, accepted_at desc);
