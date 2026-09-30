import type { ButtonHTMLAttributes, ReactNode } from 'react';

export const NavbarShell = ({ children }: { children: ReactNode }) => (
  <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white">{children}</nav>
);

export const NavbarContent = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 w-full justify-between">{children}</div>
  </div>
);

export const MobileMenuDropdown = ({ children }: { children: ReactNode }) => (
  <div
    id="mobile-menu"
    className="absolute z-50 w-full border-b border-gray-200 bg-white shadow-lg sm:hidden"
  >
    <div className="space-y-1 pt-2 pb-3">{children}</div>
  </div>
);

export const MobileMenuButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
    {...props}
  >
    {props.children}
  </button>
);
