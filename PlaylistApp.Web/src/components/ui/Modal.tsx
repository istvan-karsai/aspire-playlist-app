import { type ReactNode } from "react";

export type ModalMaxWidth = "md" | "lg" | "xl";

interface ModalProps {
    title: string;
    isOpen?: boolean;
    onClose?: () => void;
    children: ReactNode;
    maxWidth?: ModalMaxWidth;
}

export const Modal = ({ 
    title, 
    isOpen = true, 
    onClose, 
    children, 
    maxWidth = "md" 
}: ModalProps) => {
    // If the modal isn't open, don't render the markup
    if (!isOpen) return null;

    const maxWidthClasses = {
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl"
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={onClose} // Optional: clicking the backdrop closes the modal
        >
            <div 
                className={`bg-white rounded-lg shadow-xl p-6 w-full ${maxWidthClasses[maxWidth]} my-8`}
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
            >
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                {children}
            </div>
        </div>
    );
};