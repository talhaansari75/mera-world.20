alter table "user"
  add column if not exists username text;

alter table "user"
  add column if not exists "displayUsername" text;

create unique index if not exists user_username_unique
  on "user"(username)
  where username is not null;
