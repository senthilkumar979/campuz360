import * as React from 'react';
import { cn } from '../lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'default' | 'success' | 'warn' | 'accent';
}

export const Badge = ({ className, tone = 'default', ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
      tone === 'default' && 'bg-[#e6f7fd] text-primary-dark',
      tone === 'success' && 'bg-[#e3f7ec] text-success',
      tone === 'warn' && 'bg-[#fdf0e0] text-warn',
      tone === 'accent' && 'bg-[#fde8ee] text-danger',
      className,
    )}
    {...props}
  />
);
