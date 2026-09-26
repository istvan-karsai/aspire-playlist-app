import { useState } from "react";
import { CoreUILabels } from "../../core/constants/uiText";
import { MobileMenuButton, MobileMenuDropdown, NavbarContent, NavbarShell } from "./NavbarLayouts";
import { DesktopNavLink, MobileNavLink } from "./NavigationLinks";
import { HamburgerMenuIcon } from "../ui/icons/HamburgerMenuIcon";
import { CloseIcon } from "../ui/icons/CloseIcon";


export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <NavbarShell>
            <NavbarContent>
                <div className="flex">
                    <div className="shrink-0 flex items-center">
                        <span className="text-xl font-bold text-blue-600">
                            {CoreUILabels.AppTitle}
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <DesktopNavLink to="/songs" testId="nav-songs-link">
                            {CoreUILabels.NavSongs}
                        </DesktopNavLink>
                        <DesktopNavLink to="/artists" testId="nav-artists-link">
                            {CoreUILabels.NavArtists}
                        </DesktopNavLink>
                        <DesktopNavLink to="/playlists" testId="nav-playlists-link">
                            {CoreUILabels.NavPlaylists}
                        </DesktopNavLink>
                    </div>
                </div>

                {/* Mobile Hamburger Menu */}
                <div className="-mr-2 flex items-center sm:hidden">
                    <MobileMenuButton
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-controls="mobile-menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        {!isMobileMenuOpen ? (
                            <HamburgerMenuIcon className="block h-6 w-6" />
                        ) : (
                            <CloseIcon className="block h-6 w-6" />
                        )}
                    </MobileMenuButton>
                </div>
            </NavbarContent>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <MobileMenuDropdown>
                    <MobileNavLink to="/songs" onClick={closeMobileMenu}>
                        {CoreUILabels.NavSongs}
                    </MobileNavLink>
                    <MobileNavLink to="/artists" onClick={closeMobileMenu}>
                        {CoreUILabels.NavArtists}
                    </MobileNavLink>
                    <MobileNavLink to="/playlists" onClick={closeMobileMenu}>
                        {CoreUILabels.NavPlaylists}
                    </MobileNavLink>
                </MobileMenuDropdown>
            )}
        </NavbarShell>
    );
};