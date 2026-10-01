interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-foreground/20 bg-background p-5">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
