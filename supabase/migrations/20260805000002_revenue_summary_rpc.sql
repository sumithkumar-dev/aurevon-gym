-- Audit fix: `getRevenueSummary()` (lib/supabase/queries/payments.ts)
-- previously fetched every captured payment row and summed
-- `amount_paise` in JavaScript. Fine at a handful of rows; at a studio's
-- real multi-year payment volume this is an ever-growing full-table fetch
-- for two numbers Postgres can compute directly. Moved the aggregation
-- into the database, behind the same staff-only check used elsewhere
-- (`record_offline_payment()` in the previous migration) as defense in
-- depth alongside the `requireRole()` check the admin overview page
-- already does.
create or replace function public.get_revenue_summary()
returns table (all_time_paise bigint, this_month_paise bigint)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if public.current_user_role() not in ('owner', 'manager', 'receptionist') then
    raise exception 'ERR_FORBIDDEN: only staff can read revenue summaries';
  end if;

  return query
    select
      coalesce(sum(p.amount_paise), 0)::bigint as all_time_paise,
      coalesce(
        sum(p.amount_paise) filter (
          where p.created_at >= date_trunc('month', now())
        ),
        0
      )::bigint as this_month_paise
    from public.payments p
    where p.status = 'captured';
end;
$$;

comment on function public.get_revenue_summary() is
  'All-time and current-calendar-month revenue (captured payments only), aggregated in SQL rather than fetched row-by-row into the app. Staff-only, re-checked inside the function (SECURITY DEFINER bypasses RLS) as defense in depth alongside the requireRole() check the admin overview page already does.';

revoke all on function public.get_revenue_summary() from public, anon;
grant execute on function public.get_revenue_summary() to authenticated, service_role;
