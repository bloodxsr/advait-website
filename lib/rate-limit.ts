import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

const WINDOW_SECONDS = 15 * 60;
const MAX_ATTEMPTS = 10;

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  const result = await db.execute<{ count: number; reset_at: string }>(sql`
    INSERT INTO login_rate_limits (key, attempt_count, reset_at)
    VALUES (${key}, 0, now() + (${WINDOW_SECONDS} * interval '1 second'))
    ON CONFLICT (key) DO UPDATE
      SET attempt_count = CASE
        WHEN login_rate_limits.reset_at <= now() THEN 0
        ELSE login_rate_limits.attempt_count
      END,
      reset_at = CASE
        WHEN login_rate_limits.reset_at <= now()
          THEN now() + (${WINDOW_SECONDS} * interval '1 second')
        ELSE login_rate_limits.reset_at
      END
    RETURNING attempt_count AS count, extract(epoch from (reset_at - now()))::integer AS reset_at
  `);

  const row = result[0];
  if (!row) {
    throw new Error("RATE_LIMIT_STATE_UNAVAILABLE");
  }

  return {
    allowed: Number(row.count) <= MAX_ATTEMPTS,
    retryAfterSeconds: Math.max(Number(row.reset_at), 1),
  };
}

export async function recordFailedAttempt(key: string): Promise<void> {
  await db.execute(sql`
    INSERT INTO login_rate_limits (key, attempt_count, reset_at)
    VALUES (${key}, 1, now() + (${WINDOW_SECONDS} * interval '1 second'))
    ON CONFLICT (key) DO UPDATE
      SET attempt_count = CASE
        WHEN login_rate_limits.reset_at <= now() THEN 1
        ELSE login_rate_limits.attempt_count + 1
      END,
      reset_at = CASE
        WHEN login_rate_limits.reset_at <= now()
          THEN now() + (${WINDOW_SECONDS} * interval '1 second')
        ELSE login_rate_limits.reset_at
      END
  `);
}

export async function clearRateLimit(key: string): Promise<void> {
  await db.execute(sql`DELETE FROM login_rate_limits WHERE key = ${key}`);
}
