CREATE TABLE IF NOT EXISTS login_rate_limits (
  key text PRIMARY KEY,
  attempt_count integer NOT NULL DEFAULT 0,
  reset_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS login_rate_limits_reset_idx
  ON login_rate_limits (reset_at);

DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', table_name);
  END LOOP;
END
$$;

REVOKE ALL ON TABLE public.login_rate_limits FROM anon, authenticated;
