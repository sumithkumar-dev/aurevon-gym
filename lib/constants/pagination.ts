/**
 * Rows per page for admin list views (Members, Payments). Both were
 * previously unpaginated — fine with a handful of seed rows, but a full
 * unbounded `select *` (and, for Payments, a full-table fetch just to sum
 * `amount_paise` client-side) doesn't hold up once a studio has a real
 * member base. Kept small and in one place so every paginated list stays
 * consistent.
 */
export const ADMIN_PAGE_SIZE = 25;

/** Clamps a `?page=` search param to a valid 1-indexed page number. */
export function parsePageParam(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}
