import type { ReactNode } from "react";
import { Button } from "./Button";

interface CollapsibleCardProps {
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
    triggerText: string;
    title: string;
    children: ReactNode;
}

export const CollapsibleCard = ({ 
    isOpen, 
    onToggle, 
    triggerText, 
    title, 
    children 
}: CollapsibleCardProps) => {
    return (
        <div className="mb-8 w-full">
            {!isOpen ? (
                <Button onClick={() => onToggle(true)}>
                    {triggerText}
                </Button>
            ) : (
                <div className="bg-gray-50 p-6 rounded-lg border w-full animate-in fade-in slide-in-from-top-2 duration-200">
                    <h2 className="text-lg font-semibold mb-4">{title}</h2>
                    {children}
                </div>
            )}
        </div>
    );
};