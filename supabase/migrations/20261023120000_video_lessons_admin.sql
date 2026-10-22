begin;

create table if not exists public.video_lessons (
  id uuid primary key default gen_random_uuid(),
  section_id text not null check (section_id ~ '^b[0-9]+-s[0-9a-z]+$'),
  title text not null check (char_length(title) between 1 and 200),
  summary text not null default '' check (char_length(summary) <= 2000),
  transcript text not null check (char_length(transcript) between 20 and 250000),
  deliverables text[] not null default '{}',
  chapters jsonb not null default '[]'::jsonb check (jsonb_typeof(chapters) = 'array'),
  tier_required text not null check (tier_required in ('preview', 'beginner', 'full')),
  status text not null check (status in ('waiting', 'preparing', 'ready', 'errored', 'cancelled')),
  mux_upload_id text not null unique,
  mux_asset_id text unique,
  playback_id text unique,
  duration_seconds integer check (duration_seconds > 0),
  error_code text,
  created_by uuid not null references auth.users(id) on delete restrict,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cardinality(deliverables) <= 3),
  check ((published_at is null and approved_at is null and approved_by is null) or
         (published_at is not null and approved_at is not null and approved_by is not null)),
  check (published_at is null or
         (status = 'ready' and mux_asset_id is not null and playback_id is not null and duration_seconds is not null))
);

create unique index if not exists video_lessons_one_published_per_section
  on public.video_lessons (section_id)
  where published_at is not null;

create index if not exists video_lessons_published_tier_idx
  on public.video_lessons (tier_required, published_at)
  where published_at is not null;

alter table public.video_lessons enable row level security;
alter table public.video_lessons force row level security;
revoke all on table public.video_lessons from anon, authenticated;

create table if not exists public.admin_action_audit (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null check (action ~ '^[a-z0-9_.-]{3,80}$'),
  target_type text not null check (target_type ~ '^[a-z0-9_-]{2,40}$'),
  target_id text not null check (char_length(target_id) between 1 and 200),
  result text not null check (result in ('pending', 'approved', 'completed', 'refused', 'failed', 'cancelled')),
  approved_by uuid references auth.users(id) on delete set null,
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now()
);

create index if not exists admin_action_audit_created_idx
  on public.admin_action_audit (created_at desc);

alter table public.admin_action_audit enable row level security;
alter table public.admin_action_audit force row level security;
revoke all on table public.admin_action_audit from anon, authenticated;

create or replace function public.is_platform_admin(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users account
    where account.id = p_user_id
      and account.raw_app_meta_data->>'role' = 'admin'
  );
$$;

revoke all on function public.is_platform_admin(uuid) from public, anon, authenticated;
grant execute on function public.is_platform_admin(uuid) to service_role;

create or replace function public.record_admin_action(
  p_actor_user_id uuid,
  p_action text,
  p_target_type text,
  p_target_id text,
  p_result text,
  p_approved_by uuid default null,
  p_details jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if not public.is_platform_admin(p_actor_user_id) then
    raise exception 'admin authorization required' using errcode = '42501';
  end if;
  if p_approved_by is not null and p_approved_by <> p_actor_user_id then
    raise exception 'invalid admin approval' using errcode = '42501';
  end if;

  insert into public.admin_action_audit (
    actor_user_id, action, target_type, target_id, result, approved_by, details
  ) values (
    p_actor_user_id, p_action, p_target_type, p_target_id, p_result, p_approved_by,
    coalesce(p_details, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.record_admin_action(uuid, text, text, text, text, uuid, jsonb)
  from public, anon, authenticated;
grant execute on function public.record_admin_action(uuid, text, text, text, text, uuid, jsonb)
  to service_role;

create or replace function public.publish_video_lesson(
  p_video_id uuid,
  p_actor_user_id uuid
)
returns table (section_id text, previous_mux_asset_id text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_video public.video_lessons%rowtype;
  v_previous_asset text;
begin
  if not public.is_platform_admin(p_actor_user_id) then
    raise exception 'admin authorization required' using errcode = '42501';
  end if;

  select * into v_video
  from public.video_lessons
  where id = p_video_id
  for update;

  if not found
    or v_video.status <> 'ready'
    or v_video.mux_asset_id is null
    or v_video.playback_id is null
    or v_video.duration_seconds is null
    or char_length(trim(v_video.transcript)) < 20
  then
    raise exception 'video is not publishable';
  end if;

  select previous_video.mux_asset_id into v_previous_asset
  from public.video_lessons as previous_video
  where previous_video.section_id = v_video.section_id
    and previous_video.published_at is not null
    and previous_video.id <> v_video.id
  for update;

  update public.video_lessons as previous_video
  set published_at = null,
      approved_at = null,
      approved_by = null,
      updated_at = now()
  where previous_video.section_id = v_video.section_id
    and previous_video.published_at is not null
    and previous_video.id <> v_video.id;

  update public.video_lessons
  set published_at = now(),
      approved_at = now(),
      approved_by = p_actor_user_id,
      updated_at = now()
  where id = v_video.id;

  insert into public.admin_action_audit (
    actor_user_id, action, target_type, target_id, result, approved_by, details
  ) values (
    p_actor_user_id, 'video.publish', 'video_lesson', p_video_id::text, 'completed',
    p_actor_user_id,
    jsonb_build_object('sectionId', v_video.section_id, 'tier', v_video.tier_required)
  );

  return query select v_video.section_id, v_previous_asset;
end;
$$;

revoke all on function public.publish_video_lesson(uuid, uuid) from public, anon, authenticated;
grant execute on function public.publish_video_lesson(uuid, uuid) to service_role;

create or replace function public.set_admin_user_tier(
  p_actor_user_id uuid,
  p_target_user_id uuid,
  p_tier text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_updated integer;
begin
  if not public.is_platform_admin(p_actor_user_id) then
    raise exception 'admin authorization required' using errcode = '42501';
  end if;
  if p_tier is not null and p_tier not in ('beginner', 'full') then
    raise exception 'invalid tier';
  end if;
  if p_target_user_id = p_actor_user_id then
    raise exception 'an admin cannot change their own tier';
  end if;

  update public.profiles
  set tier = p_tier
  where id = p_target_user_id;
  get diagnostics v_updated = row_count;
  if v_updated <> 1 then return false; end if;

  insert into public.admin_action_audit (
    actor_user_id, action, target_type, target_id, result, approved_by, details
  ) values (
    p_actor_user_id, 'user.tier_change', 'user', p_target_user_id::text,
    'completed', p_actor_user_id, jsonb_build_object('tier', p_tier)
  );
  return true;
end;
$$;

revoke all on function public.set_admin_user_tier(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.set_admin_user_tier(uuid, uuid, text) to service_role;

commit;
