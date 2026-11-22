import * as React from 'react';
import { cn } from '../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-mut focus-visible:border-sky',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
