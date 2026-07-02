import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'flat' | 'low' | 'medium' | 'high';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevation = 'low', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-bg-card rounded-md border border-border-subtle",
          {
            'shadow-none': elevation === 'flat',
            'shadow-sm': elevation === 'low',
            'shadow-md': elevation === 'medium',
            'shadow-lg': elevation === 'high',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';
