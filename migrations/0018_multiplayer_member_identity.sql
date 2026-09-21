alter table multiplayer_members add column if not exists human_user_id text;
do $$ begin
  if not exists (select 1 from pg_constraint where conname='multiplayer_members_human_user_fk') then
    alter table multiplayer_members add constraint multiplayer_members_human_user_fk foreign key (human_user_id) references "user"(id) on delete cascade;
  end if;
end $$;
update multiplayer_members set human_user_id=user_id where coalesce(is_bot,false)=false and human_user_id is null;
create unique index if not exists multiplayer_members_human_uq on multiplayer_members(room_id,human_user_id) where human_user_id is not null;