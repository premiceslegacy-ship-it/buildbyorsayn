-- Defense in depth for the tables and functions reachable through PostgREST.
--
-- Supabase default privileges grant every new table and function in `public`
-- to anon and authenticated. Row level security already denies the unwanted
-- rows, but a single permissive policy added later would silently open these
-- tables, and TRUNCATE is not covered by row level security at all. Only the
-- privileges the browser client really needs are kept.
--
-- profiles: the app reads its own row with the user session; every write goes
-- through the service role (Stripe webhook, admin tier function).
revoke all on table public.profiles from anon;
revoke insert, update, delete, truncate, references, trigger
  on table public.profiles from authenticated;
grant select on table public.profiles to authenticated;

-- member_presence and member_activity_events are read and written only with the
-- service role (app/api/activity, admin pages, cleanup cron).
revoke all on table public.member_presence from anon, authenticated;
revoke all on table public.member_activity_events from anon, authenticated;

-- Reading public.youtube_videos stays open to the browser roles; nothing else.
revoke insert, update, delete, truncate, references, trigger
  on table public.youtube_videos from anon, authenticated;

-- has_current_accompaniment is called by RLS policies on progress, which only
-- apply to authenticated. It never answers for another user (auth.uid() is part
-- of its predicate), so only anon loses access.
revoke execute on function public.has_current_accompaniment(uuid, text) from anon;

-- rls_auto_enable is an event trigger function created by the platform on the
-- hosted project only; it must not be callable by the browser roles even though
-- PostgREST already refuses it. The revoke is conditional for fresh databases.
do $revoke_rls_auto_enable$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end
$revoke_rls_auto_enable$;
