import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

interface NavLinkProps {
    to: string;
    children: ReactNode;
    onClick?: () => void;
    testId?: string;
}

export const DesktopNavLink = ({ to, children, testId }: NavLinkProps) => {
    return (
        <NavLink 
            to={to}
            data-testid={testId}
            className={({ isActive }) => 
                isActive
                    ? "border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
            }
        >
            {children}
        </NavLink>
    );
};

export const MobileNavLink = ({ to, children, onClick, testId }: NavLinkProps) => {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            data-testid={testId}
            className={({ isActive }) => 
                isActive
                    ? "bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors"
            }
        >
            {children}
        </NavLink>
    );
};