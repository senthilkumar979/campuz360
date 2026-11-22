import * as React from 'react';
import { cn } from '../lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, accent, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-2xl border border-line bg-card p-5 shadow-sm', className)}
      style={{
        ...(accent ? { borderTop: `4px solid ${accent}` } : {}),
        ...style,
      }}
      {...props}
    />
  ),
);
Card.displayName = 'Card';
