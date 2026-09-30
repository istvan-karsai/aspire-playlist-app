import { type ReactNode } from 'react';

export type ModalMaxWidth = 'md' | 'lg' | 'xl';

interface ModalProps {
  title: string;
  isOpen?: boolean;
  onClose?: () => void;
  children: ReactNode;
  maxWidth?: ModalMaxWidth;
}

export const Modal = ({ title, isOpen = true, onClose, children, maxWidth = 'md' }: ModalProps) => {
  // If the modal isn't open, don't render the markup
  if (!isOpen) return null;

  const maxWidthClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black p-4"
      onClick={onClose} // Optional: clicking the backdrop closes the modal
    >
      <div
        className={`w-full rounded-lg bg-white p-6 shadow-xl ${maxWidthClasses[maxWidth]} my-8`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <h2 className="mb-4 text-xl font-bold">{title}</h2>
        {children}
      </div>
    </div>
  );
};
