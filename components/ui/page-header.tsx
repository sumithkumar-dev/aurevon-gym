export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="container-editorial pb-16 pt-40 md:pb-20 md:pt-48">
      <p className="eyebrow mb-6">{eyebrow}</p>
      <h1 className="font-display text-display-1 uppercase text-balance max-w-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
