import type { ButtonHTMLAttributes, ReactNode } from "react";

export const NavbarShell = ({ children }: { children: ReactNode }) => (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
        {children}
    </nav>
);

export const NavbarContent = ({ children }: { children: ReactNode }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between w-full h-16">
            {children}
        </div>
    </div>
);

export const MobileMenuDropdown = ({ children }: { children: ReactNode }) => (
    <div id="mobile-menu" className="sm:hidden shadow-lg absolute w-full bg-white z-50 border-b border-gray-200">
        <div className="pt-2 pb-3 space-y-1">
            {children}
        </div>
    </div>
);

export const MobileMenuButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        type="button"
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        {...props}
    >
        {props.children}
    </button>
);