import { NavLink } from "react-router-dom";
import { UILabels } from "../constants/uiText";
import { useState } from "react";


export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Horizontal link styles
    const getTabClass = (isActive: boolean) => {
        return isActive
            ? "border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors";
    };

    // Vertical link styles
    const getMobileTabClass = (isActive: boolean) => {
        return isActive
            ? "bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors";
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between w-full h-16">
                    <div className="flex">
                        <div className="shrink-0 flex items-center">
                            <span className="text-xl font-bold text-blue-600">
                                {UILabels.AppTitle}
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <NavLink 
                                to="/songs"
                                className={({ isActive }) => getTabClass(isActive)}
                            >
                                {UILabels.NavSongs}
                            </NavLink>

                            <NavLink
                                to="/artists"
                                className={({ isActive }) => getTabClass(isActive)}
                            >
                                {UILabels.NavArtists}
                            </NavLink>

                            <span className="border-transparent text-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-not-allowed">
                                {UILabels.NavPlaylists}
                            </span>
                        </div>
                    </div>

                        {/* Mobile Hamburger Button */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                aria-controls="mobile-menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {/* Render Hamburger Icon if closed, X Icon if open */}
                                {!isMobileMenuOpen ? (
                                    <svg 
                                        className="block h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                                    </svg>
                                ) : (
                                    <svg 
                                        className="block h-6 w-6" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor" 
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div id="mobile-menu" className="sm:hidden shadow-lg absolute w-full bg-white z-50 border-b border-gray-200">
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink
                            to="/songs"
                            onClick={closeMobileMenu}
                            className={({ isActive }) => getMobileTabClass(isActive)}
                        >
                            {UILabels.NavSongs}
                        </NavLink>
                        <NavLink
                            to="/artists"
                            onClick={closeMobileMenu}
                            className={({ isActive }) => getMobileTabClass(isActive)}
                        >
                            {UILabels.NavArtists}
                        </NavLink>
                        <span className="border-transparent text-gray-400 block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-not-allowed">
                            {UILabels.NavPlaylists}
                        </span>
                    </div>
                </div>
            )}
        </nav>
    );
};