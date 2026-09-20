-- Development fallback identity used when auth is disabled
-- and no DATABASE_URL is configured.

insert into "user" ("id", "name", "email", "emailVerified", "image")
values (
  'dev-user',
  'Dev User',
  'dev@example.com',
  true,
  null
)
on conflict do nothing;
