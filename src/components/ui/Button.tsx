import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type ButtonBaseProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
};

export type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

export type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const { variant = 'primary', size = 'md', children, className } = props;

    const baseClass = cn(
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
    );

    if (props.href) {
      const isInternal = props.href.startsWith('/') && !props.href.startsWith('//');
      const { href, ...anchorProps } = props as ButtonAsLink;

      if (isInternal) {
        return (
          <Link
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            className={baseClass}
            {...anchorProps}
          >
            {children}
          </Link>
        );
      }

      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={baseClass}
          {...anchorProps}
        >
          {children}
        </a>
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, ...buttonProps } = props as ButtonAsButton;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={baseClass}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
