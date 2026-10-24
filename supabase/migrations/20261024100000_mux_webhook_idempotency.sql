begin;

create table if not exists public.mux_webhook_events (
  event_id text primary key check (char_length(event_id) between 3 and 255),
  event_type text not null check (event_type ~ '^[a-z0-9_.-]{3,120}$'),
  received_at timestamptz not null default now(),
  processing_status text not null default 'processing' check (processing_status in ('processing', 'processed')),
  lock_owner text,
  locked_until timestamptz,
  processed_at timestamptz
);

alter table public.mux_webhook_events
  add column if not exists processing_status text not null default 'processing';
alter table public.mux_webhook_events
  add column if not exists lock_owner text;
alter table public.mux_webhook_events
  add column if not exists locked_until timestamptz;
alter table public.mux_webhook_events
  add column if not exists processed_at timestamptz;

create index if not exists mux_webhook_events_lease_idx
  on public.mux_webhook_events (processing_status, locked_until)
  where processing_status = 'processing';
alter table public.mux_webhook_events enable row level security;
alter table public.mux_webhook_events force row level security;
revoke all on table public.mux_webhook_events from public, anon, authenticated;
grant all on table public.mux_webhook_events to service_role;

create or replace function public.process_mux_asset_webhook(
  p_event_id text,
  p_event_type text,
  p_video_id uuid,
  p_upload_id text,
  p_update jsonb,
  p_audit_action text,
  p_audit_result text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_status text;
  updated_video_id uuid;
begin
  if p_event_id is null
    or char_length(p_event_id) not between 3 and 255
    or p_event_type not in ('video.asset.created', 'video.asset.ready', 'video.asset.errored')
    or p_update is null then
    raise exception 'invalid mux webhook';
  end if;

  insert into public.mux_webhook_events (event_id, event_type, processing_status)
  values (p_event_id, p_event_type, 'processing')
  on conflict (event_id) do nothing;

  if not found then
    select processing_status into existing_status
    from public.mux_webhook_events
    where event_id = p_event_id
    for update;
    if existing_status = 'processed' then return 'duplicate'; end if;
    update public.mux_webhook_events
    set processing_status = 'processing', processed_at = null
    where event_id = p_event_id;
  end if;

  if p_video_id is not null and p_upload_id is not null then
    update public.video_lessons
    set status = coalesce(p_update->>'status', status),
        mux_asset_id = coalesce(p_update->>'mux_asset_id', mux_asset_id),
        playback_id = case when p_update ? 'playback_id' then p_update->>'playback_id' else playback_id end,
        duration_seconds = case when p_update ? 'duration_seconds' then nullif(p_update->>'duration_seconds', '')::integer else duration_seconds end,
        error_code = case when p_update ? 'error_code' then p_update->>'error_code' else error_code end,
        updated_at = pg_catalog.now()
    where id = p_video_id
      and mux_upload_id = p_upload_id
      and published_at is null
      and (
        (p_event_type = 'video.asset.created' and status in ('waiting', 'preparing'))
        or (p_event_type = 'video.asset.ready' and status in ('waiting', 'preparing', 'ready'))
        or (p_event_type = 'video.asset.errored' and status in ('waiting', 'preparing', 'errored'))
      )
    returning id into updated_video_id;

    if updated_video_id is not null and p_audit_action is not null then
      insert into public.admin_action_audit (
        actor_user_id, action, target_type, target_id, result, details
      ) values (
        null, p_audit_action, 'video_lesson', p_video_id,
        coalesce(p_audit_result, 'completed'),
        pg_catalog.jsonb_build_object('eventId', p_event_id)
      );
    end if;
  end if;

  update public.mux_webhook_events
  set processing_status = 'processed',
      processed_at = pg_catalog.now(),
      lock_owner = null,
      locked_until = null
  where event_id = p_event_id;
  return case when updated_video_id is null then 'noop' else 'processed' end;
end;
$$;

revoke all on function public.process_mux_asset_webhook(text, text, uuid, text, jsonb, text, text)
  from public, anon, authenticated;
grant execute on function public.process_mux_asset_webhook(text, text, uuid, text, jsonb, text, text)
  to service_role;

comment on table public.mux_webhook_events is
  'Transactional idempotency ledger for verified Mux asset events. Failed transactions leave no processed reservation.';
drop function if exists public.reserve_mux_webhook_event(text, text);
drop function if exists public.complete_mux_webhook_event(text);

create or replace function public.reserve_mux_webhook_event(
  p_event_id text,
  p_event_type text,
  p_lock_owner text default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing_status text;
  existing_lock_until timestamptz;
begin
  if p_event_id is null
    or char_length(p_event_id) not between 3 and 255
    or p_event_type is null
    or char_length(p_event_type) not between 3 and 120
  then
    raise exception 'invalid mux webhook lease';
  end if;

  insert into public.mux_webhook_events (
    event_id, event_type, processing_status, lock_owner, locked_until
  )
  values (
    p_event_id, p_event_type, 'processing', nullif(p_lock_owner, ''), pg_catalog.now() + interval '2 minutes'
  )
  on conflict (event_id) do nothing;
  if found then return 'new'; end if;

  select processing_status, locked_until
  into existing_status, existing_lock_until
  from public.mux_webhook_events
  where event_id = p_event_id
  for update;
  if existing_status = 'processed' then return 'duplicate'; end if;
  if existing_lock_until is not null and existing_lock_until > pg_catalog.now() then
    return 'in_progress';
  end if;
  update public.mux_webhook_events
  set processing_status = 'processing',
      received_at = pg_catalog.now(),
      lock_owner = nullif(p_lock_owner, ''),
      locked_until = pg_catalog.now() + interval '2 minutes',
      processed_at = null
  where event_id = p_event_id;
  return 'retry';
end;
$$;

create or replace function public.complete_mux_webhook_event(
  p_event_id text,
  p_lock_owner text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.mux_webhook_events
  set processing_status = 'processed',
      processed_at = pg_catalog.now(),
      lock_owner = null,
      locked_until = null
  where event_id = p_event_id
    and processing_status = 'processing'
    and (p_lock_owner is null or lock_owner = p_lock_owner);
  return found;
end;
$$;

revoke all on function public.reserve_mux_webhook_event(text, text, text)
  from public, anon, authenticated;
grant execute on function public.reserve_mux_webhook_event(text, text, text)
  to service_role;
revoke all on function public.complete_mux_webhook_event(text, text)
  from public, anon, authenticated;
grant execute on function public.complete_mux_webhook_event(text, text)
  to service_role;
commit;
