import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 border border-transparent font-sans font-semibold uppercase tracking-[0.14em] text-xs transition-colors duration-200 cursor-pointer overflow-hidden rounded-none min-h-[44px]',
          variant === 'primary' && [
            'bg-crimson text-bone hover:bg-crimson-hover active:bg-crimson-press',
            'hover:shadow-[0_0_48px_rgba(225,36,63,0.25)]',
          ],
          variant === 'secondary' && [
            'bg-transparent border-bone text-bone hover:bg-bone hover:text-ink',
          ],
          variant === 'ghost' && [
            'bg-transparent text-bone hover:text-crimson-text px-0',
          ],
          size === 'sm' && 'px-4 py-2 text-[0.7rem]',
          size === 'md' && 'px-6 py-3',
          size === 'lg' && 'px-8 py-4 text-sm',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
