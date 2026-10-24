begin;

-- Ajoute le nombre calculé de destinataires sans faire confiance au payload de l'agent.
drop function if exists public.create_admin_agent_request(uuid, text, text, jsonb, uuid);
create or replace function public.create_admin_agent_request(
  p_token_id uuid,
  p_kind text,
  p_target_id text,
  p_payload jsonb,
  p_idempotency_key uuid
)
returns table (request_id uuid, request_status text, request_expires_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_token public.admin_agent_tokens%rowtype;
  v_video public.video_lessons%rowtype;
  v_audience text;
  v_pending_for_token integer;
  v_pending_total integer;
  v_recipient_count integer;
  v_request public.admin_agent_requests%rowtype;
  v_request_payload jsonb := p_payload;
begin
  if p_kind is null or p_kind not in ('publication', 'mail', 'nouveaute')
    or p_payload is null or jsonb_typeof(p_payload) <> 'object'
    or p_target_id is null or char_length(p_target_id) not between 1 and 200
    or p_idempotency_key is null
  then
    raise exception 'agent_request_invalid';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('admin_agent_requests_pending_limit', 0));

  select * into v_token
  from public.admin_agent_tokens
  where id = p_token_id
  for update;
  if not found or v_token.revoked_at is not null or v_token.expires_at <= pg_catalog.now()
    or not public.is_platform_admin(v_token.created_by) then
    raise exception 'agent_token_inactive';
  end if;

  if p_kind = 'publication' then
    if p_payload <> pg_catalog.jsonb_build_object('videoId', p_target_id) then
      raise exception 'agent_request_invalid';
    end if;
    begin perform p_target_id::uuid; exception when invalid_text_representation then raise exception 'agent_video_missing'; end;
    select * into v_video from public.video_lessons where id = p_target_id::uuid for update;
    if not found then raise exception 'agent_video_missing'; end if;
    if v_video.published_at is not null then raise exception 'agent_video_published'; end if;
    if v_video.status is distinct from 'ready' or v_video.mux_asset_id is null
      or v_video.playback_id is null or coalesce(v_video.duration_seconds, 0) <= 0 then
      raise exception 'agent_video_not_ready';
    end if;
    if pg_catalog.char_length(trim(coalesce(v_video.transcript, ''))) < 20 then raise exception 'agent_video_missing_transcript'; end if;
    if pg_catalog.char_length(trim(coalesce(v_video.summary, ''))) < 1 then raise exception 'agent_video_missing_summary'; end if;
    if pg_catalog.jsonb_typeof(v_video.chapters) <> 'array' or pg_catalog.jsonb_array_length(v_video.chapters) < 1 then raise exception 'agent_video_missing_chapters'; end if;
    if pg_catalog.char_length(trim(coalesce(v_video.thumbnail, ''))) < 1 then raise exception 'agent_video_missing_thumbnail'; end if;
  elsif p_kind = 'mail' then
    v_audience := p_payload->>'audience';
    if v_audience is null or v_audience not in ('all', 'free', 'beginner', 'full') then raise exception 'agent_mail_invalid_segment'; end if;
    if p_payload->>'campaignId' <> p_target_id then raise exception 'agent_request_invalid'; end if;
    begin perform p_target_id::uuid; exception when invalid_text_representation then raise exception 'agent_request_invalid'; end;
    select count(*) into v_recipient_count
    from auth.users as account
    join public.profiles as profile on profile.id = account.id
    where account.id <> v_token.created_by
      and nullif(account.email, '') is not null
      and (v_audience = 'all' or (v_audience = 'free' and coalesce(profile.tier, 'free') = 'free') or profile.tier = v_audience)
      and not (coalesce(profile.tier, 'free') = 'free' and account.created_at <= pg_catalog.now() - interval '14 days'
        and (account.last_sign_in_at is null or account.last_sign_in_at <= pg_catalog.now() - interval '90 days'));
    if v_recipient_count = 0 then raise exception 'agent_mail_no_recipients'; end if;
    if v_recipient_count > 10 then raise exception 'agent_mail_too_many_recipients'; end if;
    v_request_payload := p_payload || pg_catalog.jsonb_build_object('recipientCount', v_recipient_count);
  else
    if p_payload->'news' is null or pg_catalog.jsonb_typeof(p_payload->'news') <> 'object'
      or p_payload->>'thumbnailStoragePath' is null
      or p_payload->>'thumbnailStoragePath' !~ '^news/[0-9a-f-]{36}/[0-9a-f]{12}\.(jpg|png|webp)$' then
      raise exception 'agent_request_invalid';
    end if;
  end if;

  select count(*) into v_pending_for_token from public.admin_agent_requests
  where token_id = p_token_id and status = 'pending' and expires_at > pg_catalog.now();
  if v_pending_for_token >= 20 then raise exception 'agent_pending_token_limit'; end if;
  select count(*) into v_pending_total from public.admin_agent_requests
  where status = 'pending' and expires_at > pg_catalog.now();
  if v_pending_total >= 100 then raise exception 'agent_pending_global_limit'; end if;

  insert into public.admin_agent_requests (id, token_id, kind, target_id, payload, idempotency_key)
  values (p_idempotency_key, p_token_id, p_kind, p_target_id, v_request_payload, p_idempotency_key)
  on conflict (idempotency_key) do nothing
  returning * into v_request;
  if not found then
    select * into v_request from public.admin_agent_requests where idempotency_key = p_idempotency_key;
    if not found or v_request.token_id <> p_token_id or v_request.kind <> p_kind
      or v_request.target_id <> p_target_id
      or (case when p_kind = 'mail' then v_request.payload - 'recipientCount' else v_request.payload end)
        <> (case when p_kind = 'mail' then p_payload - 'recipientCount' else p_payload end) then
      raise exception 'agent_request_idempotency_conflict';
    end if;
  end if;
  return query select v_request.id, v_request.status, v_request.expires_at;
end;
$$;
revoke all on function public.create_admin_agent_request(uuid, text, text, jsonb, uuid) from public, anon, authenticated;
grant execute on function public.create_admin_agent_request(uuid, text, text, jsonb, uuid) to service_role;

drop function if exists public.expire_admin_agent_requests(uuid);
create or replace function public.expire_admin_agent_requests(p_actor_user_id uuid)
returns table (request_id uuid, request_payload jsonb)
language plpgsql security definer set search_path = ''
as $$
declare
  v_request public.admin_agent_requests%rowtype;
begin
  if not public.is_platform_admin(p_actor_user_id) then
    raise exception 'admin authorization required' using errcode = '42501';
  end if;
  for v_request in
    update public.admin_agent_requests
    set status = 'expired', updated_at = pg_catalog.now()
    where status = 'pending' and expires_at <= pg_catalog.now()
    returning *
  loop
    insert into public.admin_action_audit (
      actor_user_id, action, target_type, target_id, result, approved_by, details
    ) values (
      p_actor_user_id, 'agent.request_expire', 'agent_request', v_request.id::text,
      'cancelled', p_actor_user_id, pg_catalog.jsonb_build_object('kind', v_request.kind)
    );
    request_id := v_request.id;
    request_payload := v_request.payload;
    return next;
  end loop;
end;
$$;
revoke all on function public.expire_admin_agent_requests(uuid) from public, anon, authenticated;
grant execute on function public.expire_admin_agent_requests(uuid) to service_role;

drop function if exists public.refuse_admin_agent_request(uuid, uuid);
create or replace function public.refuse_admin_agent_request(p_request_id uuid, p_actor_user_id uuid)
returns table (request_status text, request_payload jsonb)
language plpgsql security definer set search_path = ''
as $$
declare
  v_request public.admin_agent_requests%rowtype;
begin
  if not public.is_platform_admin(p_actor_user_id) then
    raise exception 'admin authorization required' using errcode = '42501';
  end if;
  select * into v_request from public.admin_agent_requests where id = p_request_id for update;
  if not found then
    return query select 'missing'::text, null::jsonb;
    return;
  end if;
  if v_request.status <> 'pending' then
    return query select v_request.status, v_request.payload;
    return;
  end if;
  if v_request.expires_at <= pg_catalog.now() then
    update public.admin_agent_requests
    set status = 'expired', updated_at = pg_catalog.now()
    where id = p_request_id;
    insert into public.admin_action_audit (
      actor_user_id, action, target_type, target_id, result, approved_by, details
    ) values (
      p_actor_user_id, 'agent.request_expire', 'agent_request', p_request_id::text,
      'cancelled', p_actor_user_id, pg_catalog.jsonb_build_object('kind', v_request.kind)
    );
    return query select 'expired'::text, v_request.payload;
    return;
  end if;
  update public.admin_agent_requests
  set status = 'refused', decided_by = p_actor_user_id, decided_at = pg_catalog.now(), updated_at = pg_catalog.now()
  where id = p_request_id;
  return query select 'refused'::text, v_request.payload;
end;
$$;
revoke all on function public.refuse_admin_agent_request(uuid, uuid) from public, anon, authenticated;
grant execute on function public.refuse_admin_agent_request(uuid, uuid) to service_role;

alter table public.build_news
  add column if not exists thumbnail_storage_path text;
alter table public.build_news
  drop constraint if exists build_news_thumbnail_storage_path_check;
alter table public.build_news
  add constraint build_news_thumbnail_storage_path_check
  check (
    thumbnail_storage_path is null
    or thumbnail_storage_path ~ '^news/[0-9a-f-]{36}/[0-9a-f]{12}\.(jpg|png|webp)$'
  );

alter table public.build_news
  drop constraint if exists build_news_internal_url_check;
alter table public.build_news
  add constraint build_news_internal_url_check
  check (
    internal_url is null or (
      char_length(internal_url) between 1 and 2048
      and internal_url ~ '^/[A-Za-z0-9/_?=&%#.-]*$'
      and internal_url !~ '^//'
      and internal_url !~* '%(2f|5c|2e|00|09|0a|0d)'
      and internal_url !~ '(^|/)\.\.?//'
    )
  );

create table if not exists public.build_news_storage_cleanup (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique check (storage_path ~ '^news/[0-9a-f-]{36}/[0-9a-f]{12}\.(jpg|png|webp)$'),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  last_error text,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  completed_at timestamptz
);
alter table public.build_news_storage_cleanup enable row level security;
alter table public.build_news_storage_cleanup force row level security;
revoke all on table public.build_news_storage_cleanup from public, anon, authenticated;
grant all on table public.build_news_storage_cleanup to service_role;

alter table public.build_news
  drop constraint if exists build_news_thumbnail_stable_check;
alter table public.build_news
  add constraint build_news_thumbnail_stable_check
  check (
    lower(thumbnail) !~ '^https://image\.mux\.com/'
    and thumbnail !~* '(^|[?&])token='
  );

commit;
