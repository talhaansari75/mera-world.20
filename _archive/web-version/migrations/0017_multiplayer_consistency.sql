alter table multiplayer_matches add column if not exists event_version integer not null default 0;
create table if not exists multiplayer_match_event_counters(
  match_id uuid primary key references multiplayer_matches(match_id) on delete cascade,
  next_seq integer not null default 1
);
insert into multiplayer_match_event_counters(match_id,next_seq)
select match_id,coalesce(max(seq),0)+1 from multiplayer_match_events group by match_id
on conflict(match_id) do nothing;
create index if not exists multiplayer_event_counter_idx on multiplayer_match_event_counters(match_id);