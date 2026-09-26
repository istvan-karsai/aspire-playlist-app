import { type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "danger" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    isLoading?: boolean;
}

export const Button = ({ 
    children, 
    variant = "primary", 
    isLoading, 
    className = "", 
    disabled, 
    ...props 
}: ButtonProps) => {
    
    const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        danger: "bg-red-600 text-white hover:bg-red-700",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
    };

    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {children}
        </button>
    );
};