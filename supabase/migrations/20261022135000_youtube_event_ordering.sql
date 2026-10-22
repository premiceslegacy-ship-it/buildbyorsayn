begin;

create table if not exists public.youtube_video_event_state (
  video_id text primary key check (video_id ~ '^[A-Za-z0-9_-]{11}$'),
  event_at timestamptz not null,
  deleted boolean not null,
  updated_at timestamptz not null default now()
);

alter table public.youtube_video_event_state enable row level security;
alter table public.youtube_video_event_state force row level security;
revoke all on table public.youtube_video_event_state from public, anon, authenticated;

insert into public.youtube_video_event_state (video_id, event_at, deleted)
select video.video_id, video.published_at, false
from public.youtube_videos video
on conflict (video_id) do nothing;

create or replace function public.apply_youtube_feed_events(
  p_entries jsonb,
  p_tombstones jsonb
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  applied_entries integer := 0;
begin
  if p_entries is null
    or pg_catalog.jsonb_typeof(p_entries) <> 'array'
    or pg_catalog.jsonb_array_length(p_entries) > 100
    or p_tombstones is null
    or pg_catalog.jsonb_typeof(p_tombstones) <> 'array'
    or pg_catalog.jsonb_array_length(p_tombstones) > 100
  then
    raise exception 'invalid youtube feed event batch';
  end if;

  with input as (
    select row.video_id, row.title, row.published_at, row.event_at
    from pg_catalog.jsonb_to_recordset(p_entries) as row(
      video_id text,
      title text,
      published_at timestamptz,
      event_at timestamptz
    )
    where row.video_id ~ '^[A-Za-z0-9_-]{11}$'
      and pg_catalog.length(row.title) between 1 and 500
      and row.published_at is not null
      and row.event_at is not null
  ), accepted as (
    insert into public.youtube_video_event_state as state (
      video_id, event_at, deleted, updated_at
    )
    select input.video_id, input.event_at, false, pg_catalog.now()
    from input
    on conflict (video_id) do update
      set event_at = excluded.event_at,
          deleted = false,
          updated_at = pg_catalog.now()
      where excluded.event_at > state.event_at
         or (excluded.event_at = state.event_at and state.deleted = false)
    returning video_id, event_at
  )
  insert into public.youtube_videos as video (
    video_id, title, published_at, updated_at
  )
  select input.video_id, input.title, input.published_at, pg_catalog.now()
  from input
  join accepted
    on accepted.video_id = input.video_id
   and accepted.event_at = input.event_at
  on conflict (video_id) do update
    set title = excluded.title,
        published_at = excluded.published_at,
        updated_at = pg_catalog.now();

  get diagnostics applied_entries = row_count;

  with input as (
    select row.video_id, row.deleted_at
    from pg_catalog.jsonb_to_recordset(p_tombstones) as row(
      video_id text,
      deleted_at timestamptz
    )
    where row.video_id ~ '^[A-Za-z0-9_-]{11}$'
      and row.deleted_at is not null
  ), accepted as (
    insert into public.youtube_video_event_state as state (
      video_id, event_at, deleted, updated_at
    )
    select input.video_id, input.deleted_at, true, pg_catalog.now()
    from input
    on conflict (video_id) do update
      set event_at = excluded.event_at,
          deleted = true,
          updated_at = pg_catalog.now()
      where excluded.event_at >= state.event_at
    returning video_id, event_at
  )
  delete from public.youtube_videos video
  using accepted
  where video.video_id = accepted.video_id;

  return applied_entries;
end;
$$;

revoke all on function public.apply_youtube_feed_events(jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.apply_youtube_feed_events(jsonb, jsonb) to service_role;

commit;
