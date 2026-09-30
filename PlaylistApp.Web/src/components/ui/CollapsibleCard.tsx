import type { ReactNode } from 'react';
import { Button } from './Button';

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
  children,
}: CollapsibleCardProps) => {
  return (
    <div className="mb-8 w-full">
      {!isOpen ? (
        <Button onClick={() => onToggle(true)}>{triggerText}</Button>
      ) : (
        <div className="animate-in fade-in slide-in-from-top-2 w-full rounded-lg border bg-gray-50 p-6 duration-200">
          <h2 className="mb-4 text-lg font-semibold">{title}</h2>
          {children}
        </div>
      )}
    </div>
  );
};
