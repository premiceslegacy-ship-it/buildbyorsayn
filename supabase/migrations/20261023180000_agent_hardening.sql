begin;

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
begin
  if p_kind is null or p_kind not in ('publication', 'mail')
    or p_payload is null or jsonb_typeof(p_payload) <> 'object'
    or p_target_id is null or char_length(p_target_id) not between 1 and 200
    or p_idempotency_key is null
  then
    raise exception 'agent_request_invalid';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('admin_agent_requests_pending_limit', 0));

  select * into v_token
  from public.admin_agent_tokens
  where id = p_token_id
  for update;

  if not found or v_token.revoked_at is not null or v_token.expires_at <= now()
    or not public.is_platform_admin(v_token.created_by)
  then
    raise exception 'agent_token_inactive';
  end if;

  if p_kind = 'publication' then
    if p_payload <> jsonb_build_object('videoId', p_target_id) then
      raise exception 'agent_request_invalid';
    end if;
    begin
      perform p_target_id::uuid;
    exception when invalid_text_representation then
      raise exception 'agent_video_missing';
    end;

    select * into v_video
    from public.video_lessons
    where id = p_target_id::uuid
    for update;
    if not found then raise exception 'agent_video_missing'; end if;
    if v_video.published_at is not null then raise exception 'agent_video_published'; end if;
    if v_video.status is distinct from 'ready' or v_video.mux_asset_id is null
      or v_video.playback_id is null or coalesce(v_video.duration_seconds, 0) <= 0
    then
      raise exception 'agent_video_not_ready';
    end if;
    if char_length(trim(coalesce(v_video.transcript, ''))) < 20 then
      raise exception 'agent_video_missing_transcript';
    end if;
    if char_length(trim(coalesce(v_video.summary, ''))) < 1 then
      raise exception 'agent_video_missing_summary';
    end if;
    if jsonb_typeof(v_video.chapters) <> 'array' or jsonb_array_length(v_video.chapters) < 1 then
      raise exception 'agent_video_missing_chapters';
    end if;
    if char_length(trim(coalesce(v_video.thumbnail, ''))) < 1 then
      raise exception 'agent_video_missing_thumbnail';
    end if;
  else
    v_audience := p_payload->>'audience';
    if v_audience is null or v_audience not in ('all', 'free', 'beginner', 'full') then
      raise exception 'agent_mail_invalid_segment';
    end if;
    if p_payload->>'campaignId' <> p_target_id then
      raise exception 'agent_request_invalid';
    end if;
    begin
      perform p_target_id::uuid;
    exception when invalid_text_representation then
      raise exception 'agent_request_invalid';
    end;

    select count(*) into v_recipient_count
    from auth.users as account
    join public.profiles as profile on profile.id = account.id
    where account.id <> v_token.created_by
      and nullif(account.email, '') is not null
      and (
        v_audience = 'all'
        or (v_audience = 'free' and coalesce(profile.tier, 'free') = 'free')
        or profile.tier = v_audience
      )
      and not (
        coalesce(profile.tier, 'free') = 'free'
        and account.created_at <= now() - interval '14 days'
        and (
          account.last_sign_in_at is null
          or account.last_sign_in_at <= now() - interval '90 days'
        )
      );
    if v_recipient_count = 0 then raise exception 'agent_mail_no_recipients'; end if;
    if v_recipient_count > 10 then raise exception 'agent_mail_too_many_recipients'; end if;
  end if;

  select count(*) into v_pending_for_token
  from public.admin_agent_requests
  where token_id = p_token_id and status = 'pending' and expires_at > now();
  if v_pending_for_token >= 20 then
    raise exception 'agent_pending_token_limit';
  end if;

  select count(*) into v_pending_total
  from public.admin_agent_requests
  where status = 'pending' and expires_at > now();
  if v_pending_total >= 100 then
    raise exception 'agent_pending_global_limit';
  end if;

  insert into public.admin_agent_requests (
    id, token_id, kind, target_id, payload, idempotency_key
  ) values (
    p_idempotency_key, p_token_id, p_kind, p_target_id, p_payload, p_idempotency_key
  )
  on conflict (idempotency_key) do nothing
  returning * into v_request;

  if not found then
    select * into v_request
    from public.admin_agent_requests
    where idempotency_key = p_idempotency_key;
    if not found or v_request.token_id <> p_token_id or v_request.kind <> p_kind
      or v_request.target_id <> p_target_id or v_request.payload <> p_payload
    then
      raise exception 'agent_request_idempotency_conflict';
    end if;
  end if;

  return query select v_request.id, v_request.status, v_request.expires_at;
end;
$$;

revoke all on function public.create_admin_agent_request(uuid, text, text, jsonb, uuid)
  from public, anon, authenticated;
grant execute on function public.create_admin_agent_request(uuid, text, text, jsonb, uuid)
  to service_role;

create index if not exists admin_agent_requests_pending_token_idx
  on public.admin_agent_requests (token_id, created_at)
  where status = 'pending';

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

  if not found then raise exception 'video is not publishable'; end if;
  if v_video.published_at is not null then raise exception 'video is already published'; end if;
  if v_video.status is distinct from 'ready' or v_video.mux_asset_id is null
    or v_video.playback_id is null or coalesce(v_video.duration_seconds, 0) <= 0
    or char_length(trim(coalesce(v_video.transcript, ''))) < 20
    or char_length(trim(coalesce(v_video.summary, ''))) < 1
    or jsonb_typeof(v_video.chapters) <> 'array'
    or jsonb_array_length(v_video.chapters) < 1
    or char_length(trim(coalesce(v_video.thumbnail, ''))) < 1
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

commit;
