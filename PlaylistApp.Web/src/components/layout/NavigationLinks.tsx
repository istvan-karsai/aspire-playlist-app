import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

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
          ? 'inline-flex items-center border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-gray-900'
          : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700'
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
          ? 'block border-l-4 border-blue-500 bg-blue-50 py-2 pr-4 pl-3 text-base font-medium text-blue-700'
          : 'block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
      }
    >
      {children}
    </NavLink>
  );
};
