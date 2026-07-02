import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-sm border border-border-subtle bg-bg-app px-3 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
          {
            'border-error focus:ring-error': error,
          },
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
