import { type ReactNode } from "react";

export type AlertVariant = "error" | "info" | "success" | "warning";

interface AlertProps {
    children: ReactNode;
    variant?: AlertVariant;
    className?: string;
}

export const Alert = ({ children, variant = "error", className = "" }: AlertProps) => {
    const variants = {
        error: "bg-red-100 text-red-700",
        info: "bg-blue-100 text-blue-700",
        success: "bg-green-100 text-green-700",
        warning: "bg-yellow-100 text-yellow-700"
    };

    return (
        <div className={`p-3 rounded-md w-full text-sm ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
};