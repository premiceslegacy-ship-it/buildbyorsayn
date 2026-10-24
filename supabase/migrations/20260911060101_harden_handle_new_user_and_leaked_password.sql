-- Security hardening found by a manual audit + Supabase advisors:
-- 1. handle_new_user() was callable directly via PostgREST RPC by anon/authenticated,
--    even though it is only meant to run as the auth.users insert trigger. It takes
--    no tier-related argument, so this was not a tier-escalation path, but it did let
--    anyone insert spurious/duplicate rows into public.profiles at will.
-- 2. handle_new_user() had a mutable search_path (function_search_path_mutable lint).
-- Pinning search_path and revoking direct EXECUTE closes both without touching the
-- trigger wiring itself, since triggers invoke the function through the table owner,
-- not through a role that needs EXECUTE.

alter function public.handle_new_user() set search_path = 'public', 'pg_temp';

-- PostgreSQL grants EXECUTE to PUBLIC by default; revoking only anon/authenticated
-- leaves it reachable through the PUBLIC grant, so PUBLIC must be revoked explicitly.
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;
