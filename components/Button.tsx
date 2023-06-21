import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

//* Define the props interface for the Button component.
//* It extends button HTML attributes, enabling all native button attributes.
interface ButtonProps 
extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

//* Define the Button component using forwardRef to allow ref pass-through.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    children,
    disabled,
    type = "button",
    ...props
}, ref) => {
    return (
        //* Button with merged tailwind classes and optional className.
        <button 
            type={type} 
            className={twMerge(`
            w-full
            rounded-full
            bg-green-500
            border
            border-transparent
            px-3 
            py-3
            disabled:cursor-not-allowed
            disabled:opacity-50
            text-black
            font-bold
            hover:opacity-75
            transition
        `,
            className  
        )} 
        disabled={disabled}
        ref={ref}
        {...props}
        >
            {children}
        </button>
    )
})

//* Set displayName for the Button component.
Button.displayName = "Button";