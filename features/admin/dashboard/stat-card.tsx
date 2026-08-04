export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="border border-border bg-surface p-6">
      <p className="text-xs uppercase tracking-widest2 text-muted">{label}</p>
      <p className="mt-3 font-display text-3xl uppercase text-foreground">
        {value}
      </p>
      {hint && <p className="mt-2 text-sm text-muted">{hint}</p>}
    </div>
  );
}
