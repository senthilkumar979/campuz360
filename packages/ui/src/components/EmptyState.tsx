import { cn } from '../lib/cn';

export interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export const EmptyState = ({ title, description, className }: EmptyStateProps) => (
  <div
    className={cn(
      'rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center',
      className,
    )}
  >
    <h3 className="text-lg font-bold text-ink">{title}</h3>
    {description ? <p className="mt-2 text-sm text-mut">{description}</p> : null}
  </div>
);
