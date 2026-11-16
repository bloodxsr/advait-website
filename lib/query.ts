const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export function parseLimit(value: string | null, fallback = DEFAULT_LIMIT): number {
  if (!value) return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;

  return Math.min(parsed, MAX_LIMIT);
}

export function parseOffset(value: string | null): number {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
}
