begin;

-- There are intentionally no existing video_lessons rows. This is a clean cutover:
-- videos belong to a block and position, never to a written chapter.
do $$
begin
  if exists (select 1 from public.video_lessons limit 1) then
    raise exception 'video_lessons must be empty before the block video cutover';
  end if;
end;
$$;

drop index if exists public.video_lessons_one_published_per_section;

alter table public.video_lessons
  drop column if exists section_id,
  add column bloc_id text,
  add column "position" integer,
  add column replaced_at timestamptz,
  add column transcript_segments jsonb not null default '[]'::jsonb,
  add column transcript_source text not null default 'automatic',
  add column subtitle_track_id text,
  add column created_by_agent_token_id uuid references public.admin_agent_tokens(id) on delete set null;

alter table public.video_lessons
  add constraint video_lessons_bloc_id_check
    check (bloc_id in ('1', '2', '3', '4', '5', '6', '7', 'protocole')),
  add constraint video_lessons_position_check
    check ("position" >= 1),
  add constraint video_lessons_transcript_segments_check
    check (jsonb_typeof(transcript_segments) = 'array'),
  add constraint video_lessons_transcript_source_check
    check (transcript_source in ('automatic', 'manual'));

alter table public.video_lessons
  alter column bloc_id set not null,
  alter column "position" set not null;

alter table public.video_lessons
  add constraint video_lessons_thumbnail_format_check
    check (
      thumbnail is null
      or thumbnail ~ '^mux:[0-9]+$'
      or thumbnail ~ '^storage:[0-9a-f-]{36}/[0-9a-f]{12}\.(jpg|png|webp)$'
    );

create unique index video_lessons_one_current_per_position
  on public.video_lessons (bloc_id, "position")
  where published_at is not null and replaced_at is null;

create index video_lessons_bloc_position_idx
  on public.video_lessons (bloc_id, "position", created_at desc);

create table if not exists public.video_asset_cleanup (
  id uuid primary key default gen_random_uuid(),
  mux_asset_id text not null unique,
  video_id uuid not null references public.video_lessons(id) on delete cascade,
  storage_path text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  last_error text,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  completed_at timestamptz
);

alter table public.video_asset_cleanup enable row level security;
alter table public.video_asset_cleanup force row level security;
revoke all on table public.video_asset_cleanup from public, anon, authenticated;
grant all on table public.video_asset_cleanup to service_role;

do $$
begin
  if pg_catalog.to_regclass('storage.buckets') is not null
    and pg_catalog.to_regclass('storage.objects') is not null then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values (
      'video-thumbnails',
      'video-thumbnails',
      true,
      1500000,
      array['image/jpeg', 'image/png', 'image/webp']::text[]
    )
    on conflict (id) do update set
      public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
    execute 'drop policy if exists video_thumbnails_public_read on storage.objects';
    execute 'drop policy if exists video_thumbnails_service_insert on storage.objects';
    execute 'drop policy if exists video_thumbnails_service_update on storage.objects';
    execute 'drop policy if exists video_thumbnails_service_delete on storage.objects';
    execute 'create policy video_thumbnails_public_read on storage.objects for select to public using (bucket_id = ''video-thumbnails'')';
    execute 'create policy video_thumbnails_service_insert on storage.objects for insert to service_role with check (bucket_id = ''video-thumbnails'')';
    execute 'create policy video_thumbnails_service_update on storage.objects for update to service_role using (bucket_id = ''video-thumbnails'') with check (bucket_id = ''video-thumbnails'')';
    execute 'create policy video_thumbnails_service_delete on storage.objects for delete to service_role using (bucket_id = ''video-thumbnails'')';
  end if;
end;
$$;

drop function if exists public.publish_video_lesson(uuid, uuid);

create or replace function public.publish_video_lesson(
  p_video_id uuid,
  p_actor_user_id uuid
)
returns table (bloc_id text, "position" integer, previous_mux_asset_id text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_video public.video_lessons%rowtype;
  v_previous_video_id uuid;
  v_previous_asset text;
  v_previous_storage_path text;
begin
  if not public.is_platform_admin(p_actor_user_id) then
    raise exception 'admin authorization required' using errcode = '42501';
  end if;
  select * into v_video
  from public.video_lessons
  where id = p_video_id;
  if v_video.id is null then
    raise exception 'video is not publishable';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      pg_catalog.format('video-slot:%s:%s', v_video.bloc_id, v_video."position"),
      0
    )
  );

  select * into v_video
  from public.video_lessons
  where id = p_video_id
  for update;
  if v_video.id is null
    or v_video.replaced_at is not null
    or v_video.status <> 'ready'
    or v_video.mux_asset_id is null
    or v_video.playback_id is null
    or v_video.duration_seconds is null
    or char_length(trim(v_video.transcript)) < 20
  then
    raise exception 'video is not publishable';
  end if;

  select previous_video.id,
         previous_video.mux_asset_id,
         case when previous_video.thumbnail like 'storage:%'
           then pg_catalog.substr(previous_video.thumbnail, 9)
           else null
         end
    into v_previous_video_id, v_previous_asset, v_previous_storage_path
  from public.video_lessons as previous_video
  where previous_video.bloc_id = v_video.bloc_id
    and previous_video."position" = v_video."position"
    and previous_video.published_at is not null
    and previous_video.replaced_at is null
    and previous_video.id <> v_video.id
  for update;

  update public.video_lessons as previous_video
  set published_at = null,
      approved_at = null,
      approved_by = null,
      replaced_at = pg_catalog.now(),
      updated_at = pg_catalog.now()
  where previous_video.bloc_id = v_video.bloc_id
    and previous_video."position" = v_video."position"
    and previous_video.published_at is not null
    and previous_video.replaced_at is null
    and previous_video.id <> v_video.id;
  if v_previous_asset is not null then
    insert into public.video_asset_cleanup (mux_asset_id, video_id, storage_path)
    values (v_previous_asset, v_previous_video_id, v_previous_storage_path)
    on conflict (mux_asset_id) do update
      set storage_path = coalesce(public.video_asset_cleanup.storage_path, excluded.storage_path);
  end if;

  update public.video_lessons
  set published_at = pg_catalog.now(),
      approved_at = pg_catalog.now(),
      approved_by = p_actor_user_id,
      replaced_at = null,
      updated_at = pg_catalog.now()
  where id = v_video.id;

  insert into public.admin_action_audit (
    actor_user_id, action, target_type, target_id, result, approved_by, details
  ) values (
    p_actor_user_id, 'video.publish', 'video_lesson', p_video_id::text, 'completed',
    p_actor_user_id,
    pg_catalog.jsonb_build_object(
      'blocId', v_video.bloc_id,
      'position', v_video."position",
      'tier', v_video.tier_required
    )
  );

  return query select v_video.bloc_id, v_video."position", v_previous_asset;
end;
$$;

revoke all on function public.publish_video_lesson(uuid, uuid) from public, anon, authenticated;
grant execute on function public.publish_video_lesson(uuid, uuid) to service_role;

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_catalog.pg_constraint
    where conrelid = 'public.admin_agent_tokens'::regclass
      and contype = 'c'
      and (
        pg_catalog.pg_get_constraintdef(oid) like '%permissions%'
        or pg_catalog.pg_get_constraintdef(oid) like '%cardinality%'
      )
  loop
    execute format('alter table public.admin_agent_tokens drop constraint %I', constraint_name);
  end loop;
end;
$$;

alter table public.admin_agent_tokens
  add constraint admin_agent_tokens_permissions_cardinality_check
    check (cardinality(permissions) <= 14),
  add constraint admin_agent_tokens_permissions_values_check
    check (permissions <@ array[
      'liste_blocs', 'lister_videos', 'envoyer_video', 'lire_transcription',
      'ecrire_chapitres', 'ecrire_resume', 'choisir_miniature', 'deposer_miniature',
      'demander_publication', 'synchroniser_video', 'deposer_sous_titres',
      'preparer_mail', 'statut_video', 'journal'
    ]::text[]);

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
      and replaced_at is null
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

commit;
