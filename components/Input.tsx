import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        className={twMerge(
          `flex w-full rounded-lg bg-input border border-border
           px-4 py-3 text-sm text-foreground
           file:border-0 file:bg-transparent file:text-sm file:font-medium
           placeholder:text-muted-foreground
           disabled:cursor-not-allowed disabled:opacity-50
           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
           transition-all duration-200`,
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
