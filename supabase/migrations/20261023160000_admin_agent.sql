begin;

alter table public.video_lessons
  drop constraint if exists video_lessons_transcript_check,
  alter column transcript set default '';

alter table public.video_lessons
  add constraint video_lessons_transcript_check
  check (char_length(transcript) between 0 and 250000);

alter table public.video_lessons
  add column if not exists thumbnail text
  check (thumbnail is null or char_length(thumbnail) between 1 and 2048);

alter table public.video_lessons
  add constraint video_lessons_agent_publish_ready_check
  check (
    published_at is null or (
      char_length(trim(transcript)) >= 20
      and char_length(trim(summary)) >= 1
      and jsonb_array_length(chapters) >= 1
      and thumbnail is not null
    )
  ) not valid;

create table public.admin_agent_tokens (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  last_four text not null check (last_four ~ '^[A-Za-z0-9_-]{4}$'),
  permissions text[] not null default '{}',
  expires_at timestamptz not null default (now() + interval '90 days'),
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  check (cardinality(permissions) <= 9),
  check (permissions <@ array[
    'liste_blocs', 'envoyer_video', 'ecrire_chapitres', 'ecrire_resume',
    'choisir_miniature', 'demander_publication', 'preparer_mail',
    'statut_video', 'journal'
  ]::text[]),
  check (expires_at > created_at)
);

create index admin_agent_tokens_active_hash_idx
  on public.admin_agent_tokens (token_hash) where revoked_at is null;
alter table public.admin_agent_tokens enable row level security;
alter table public.admin_agent_tokens force row level security;
revoke all on table public.admin_agent_tokens from anon, authenticated;

create table public.admin_agent_settings (
  singleton boolean primary key default true check (singleton),
  mode text not null default 'prepare' check (mode in ('prepare', 'autopublish')),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);
insert into public.admin_agent_settings (singleton, mode) values (true, 'prepare')
on conflict (singleton) do nothing;
alter table public.admin_agent_settings enable row level security;
alter table public.admin_agent_settings force row level security;
revoke all on table public.admin_agent_settings from anon, authenticated;

create table public.admin_agent_requests (
  id uuid primary key default gen_random_uuid(),
  token_id uuid not null references public.admin_agent_tokens(id) on delete restrict,
  kind text not null check (kind in ('publication', 'mail')),
  target_id text not null check (char_length(target_id) between 1 and 200),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  status text not null default 'pending'
    check (status in ('pending', 'executing', 'approved', 'refused', 'expired', 'failed')),
  idempotency_key uuid not null unique,
  expires_at timestamptz not null default (now() + interval '7 days'),
  decided_by uuid references auth.users(id) on delete set null,
  decided_at timestamptz,
  executed_at timestamptz,
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at <= created_at + interval '7 days'),
  check ((status = 'pending' and decided_by is null and decided_at is null) or status <> 'pending')
);
create index admin_agent_requests_pending_idx
  on public.admin_agent_requests (created_at) where status = 'pending';
alter table public.admin_agent_requests enable row level security;
alter table public.admin_agent_requests force row level security;
revoke all on table public.admin_agent_requests from anon, authenticated;

create table public.admin_agent_rate_limits (
  subject_hash text not null,
  window_start timestamptz not null,
  request_count integer not null check (request_count > 0),
  primary key (subject_hash, window_start)
);
create index admin_agent_rate_limits_window_idx
  on public.admin_agent_rate_limits (window_start);
alter table public.admin_agent_rate_limits enable row level security;
alter table public.admin_agent_rate_limits force row level security;
revoke all on table public.admin_agent_rate_limits from anon, authenticated;

create or replace function public.check_admin_agent_rate_limit(
  p_subject text, p_max_per_window integer, p_window_seconds integer
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_window timestamptz;
  v_count integer;
begin
  if char_length(p_subject) < 20 or p_max_per_window < 1 or p_max_per_window > 10000
    or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'invalid rate limit input';
  end if;
  v_window := to_timestamp(floor(extract(epoch from clock_timestamp()) / p_window_seconds) * p_window_seconds);
  delete from public.admin_agent_rate_limits
  where window_start < v_window - interval '2 days';
  insert into public.admin_agent_rate_limits (subject_hash, window_start, request_count)
  values (p_subject, v_window, 1)
  on conflict (subject_hash, window_start) do update
  set request_count = public.admin_agent_rate_limits.request_count + 1
  returning request_count into v_count;
  return v_count <= p_max_per_window;
end;
$$;
revoke all on function public.check_admin_agent_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_admin_agent_rate_limit(text, integer, integer) to service_role;

create or replace function public.claim_admin_agent_request(p_request_id uuid, p_actor_user_id uuid)
returns table (
  request_id uuid,
  request_kind text,
  request_target_id text,
  request_payload jsonb,
  request_status text,
  request_claimed boolean
)
language plpgsql security definer set search_path = '' as $$
declare
  v_request public.admin_agent_requests%rowtype;
  v_claimed boolean := false;
begin
  if not public.is_platform_admin(p_actor_user_id) then
    raise exception 'admin authorization required' using errcode = '42501';
  end if;
  select * into v_request from public.admin_agent_requests where id = p_request_id for update;
  if not found then return; end if;
  if v_request.status = 'pending' and v_request.expires_at <= now() then
    update public.admin_agent_requests set status = 'expired', updated_at = now() where id = p_request_id;
    v_request.status := 'expired';
    insert into public.admin_action_audit (
      actor_user_id, action, target_type, target_id, result, approved_by, details
    ) values (
      p_actor_user_id, 'agent.request_expire', 'agent_request', p_request_id::text,
      'cancelled', p_actor_user_id, jsonb_build_object('kind', v_request.kind)
    );
  elsif v_request.status = 'pending' then
    update public.admin_agent_requests
    set status = 'executing', decided_by = p_actor_user_id, decided_at = now(), updated_at = now()
    where id = p_request_id;
    v_request.status := 'executing';
    v_claimed := true;
  end if;
  return query select v_request.id, v_request.kind, v_request.target_id,
    v_request.payload, v_request.status, v_claimed;
end;
$$;
revoke all on function public.claim_admin_agent_request(uuid, uuid) from public, anon, authenticated;
grant execute on function public.claim_admin_agent_request(uuid, uuid) to service_role;

create or replace function public.expire_admin_agent_requests(p_actor_user_id uuid)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  v_count integer;
begin
  if not public.is_platform_admin(p_actor_user_id) then
    raise exception 'admin authorization required' using errcode = '42501';
  end if;
  with expired as (
    update public.admin_agent_requests
    set status = 'expired', updated_at = now()
    where status = 'pending' and expires_at <= now()
    returning id, kind
  ), audited as (
    insert into public.admin_action_audit (
      actor_user_id, action, target_type, target_id, result, approved_by, details
    )
    select p_actor_user_id, 'agent.request_expire', 'agent_request', expired.id::text,
      'cancelled', p_actor_user_id, jsonb_build_object('kind', expired.kind)
    from expired
    returning 1
  )
  select count(*) into v_count from audited;
  return v_count;
end;
$$;
revoke all on function public.expire_admin_agent_requests(uuid) from public, anon, authenticated;
grant execute on function public.expire_admin_agent_requests(uuid) to service_role;

create or replace function public.refuse_admin_agent_request(p_request_id uuid, p_actor_user_id uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_request public.admin_agent_requests%rowtype;
begin
  if not public.is_platform_admin(p_actor_user_id) then
    raise exception 'admin authorization required' using errcode = '42501';
  end if;
  select * into v_request from public.admin_agent_requests where id = p_request_id for update;
  if not found then return 'missing'; end if;
  if v_request.status = 'refused' then return 'refused'; end if;
  if v_request.status <> 'pending' then return v_request.status; end if;
  if v_request.expires_at <= now() then
    update public.admin_agent_requests set status = 'expired', updated_at = now() where id = p_request_id;
    insert into public.admin_action_audit (
      actor_user_id, action, target_type, target_id, result, approved_by, details
    ) values (
      p_actor_user_id, 'agent.request_expire', 'agent_request', p_request_id::text,
      'cancelled', p_actor_user_id, jsonb_build_object('kind', v_request.kind)
    );
    return 'expired';
  end if;
  update public.admin_agent_requests
  set status = 'refused', decided_by = p_actor_user_id, decided_at = now(), updated_at = now()
  where id = p_request_id;
  return 'refused';
end;
$$;
revoke all on function public.refuse_admin_agent_request(uuid, uuid) from public, anon, authenticated;
grant execute on function public.refuse_admin_agent_request(uuid, uuid) to service_role;

commit;
