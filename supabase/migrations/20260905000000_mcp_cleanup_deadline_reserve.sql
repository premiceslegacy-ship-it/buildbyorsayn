-- Keep database cleanup work inside the cron's application deadline.
-- The HTTP route stops waiting after 6 seconds and Vercel stops the route after
-- 10 seconds, leaving time for parsing, structured logging, and a controlled
-- response. The SQL statement must therefore finish sooner than the HTTP call.

alter function public.cleanup_mcp_oauth_state(integer)
  set statement_timeout = '5s';
