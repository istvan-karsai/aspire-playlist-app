import { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = ({ label, error, id, className = "", ...props }: TextareaProps) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <textarea
                id={id}
                className={`w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white resize-y focus:ring-blue-500 focus:border-blue-500 ${
                    error ? "border-red-500" : ""
                } ${className}`}
                {...props}
            />
            {error && <span className="text-sm text-red-600 mt-1 block">{error}</span>}
        </div>
    );
};