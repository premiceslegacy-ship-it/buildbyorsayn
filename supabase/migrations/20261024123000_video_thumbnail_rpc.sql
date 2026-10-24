begin;

drop function if exists public.replace_video_thumbnail(uuid, uuid, text);

create or replace function public.replace_video_thumbnail(
  p_video_id uuid,
  p_actor_user_id uuid,
  p_thumbnail text,
  p_allow_published boolean default true
)
returns table (old_storage_path text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_video public.video_lessons%rowtype;
  v_old_storage_path text;
begin
  if not public.is_platform_admin(p_actor_user_id) then
    raise exception 'admin authorization required' using errcode = '42501';
  end if;
  if p_thumbnail is null
    or p_thumbnail !~ '^mux:[0-9]+$'
    and p_thumbnail !~ '^storage:[0-9a-f-]{36}/[0-9a-f]{12}\.(jpg|png|webp)$'
  then
    raise exception 'thumbnail format invalid';
  end if;

  select * into v_video
  from public.video_lessons
  where id = p_video_id
  for update;
  if v_video.id is null or v_video.replaced_at is not null or v_video.status <> 'ready'
    or (v_video.published_at is not null and not p_allow_published) then
    raise exception 'video thumbnail is not writable';
  end if;

  if v_video.thumbnail like 'storage:%' then
    v_old_storage_path := pg_catalog.substr(v_video.thumbnail, 9);
  end if;

  update public.video_lessons
  set thumbnail = p_thumbnail,
      updated_at = pg_catalog.now()
  where id = p_video_id;

  return query select v_old_storage_path;
end;
$$;

revoke all on function public.replace_video_thumbnail(uuid, uuid, text, boolean) from public, anon, authenticated;
grant execute on function public.replace_video_thumbnail(uuid, uuid, text, boolean) to service_role;

commit;
