import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, type = 'button', variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center
      rounded-full font-semibold
      transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
      disabled:pointer-events-none disabled:opacity-50
      active:scale-[0.98]
    `;

    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25',
      outline: 'border border-border bg-transparent hover:bg-secondary hover:text-secondary-foreground',
      ghost: 'hover:bg-secondary hover:text-secondary-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    };

    const sizes = {
      default: 'h-11 px-6 py-2',
      sm: 'h-9 px-4 text-sm',
      lg: 'h-12 px-8 text-lg',
      icon: 'h-10 w-10',
    };

    return (
      <button
        type={type}
        className={twMerge(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
