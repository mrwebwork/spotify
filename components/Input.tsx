import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

//* Define an interface for the Input component props
interface InputProps 
    extends React.InputHTMLAttributes<HTMLInputElement>{

}
//* Define the Input functional component
export const Input = forwardRef<HTMLInputElement, InputProps>(({
    className,
    type,
    disabled,
    ...props
}, ref) => {
    return (
        //* Render an input field
        <input
        type={type}
        className={twMerge(`first-letter:
        flex 
        w-full
        rounded-md
        bg-neutral-700
        border
        border-transparent
        px-3
        py-3
        text-sm
        file:border-0
        file:bg-transparent
        file:text-sm
        file:font-medium
        placeholder:text-neutral-400
        disabled:cursor-not-allowed
        disabled:opacity-50
        focus:outline-none
        `,
        className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
        />
    )
})

Input.displayName = "Input";