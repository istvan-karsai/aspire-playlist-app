import { useState } from 'react';
import { CoreUILabels, CoreUILayout } from '../../core/constants/uiText';
import { MobileMenuButton, MobileMenuDropdown, NavbarContent, NavbarShell } from './NavbarLayouts';
import { DesktopNavLink, MobileNavLink } from './NavigationLinks';
import { HamburgerMenuIcon } from '../ui/icons/HamburgerMenuIcon';
import { CloseIcon } from '../ui/icons/CloseIcon';
import { ROUTES } from '../../core/constants/routes';
import { CoreTestIds } from '../../core/constants/testIds';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <NavbarShell>
      <NavbarContent>
        <div className="flex">
          <div className="flex shrink-0 items-center">
            <span className="text-xl font-bold text-blue-600">{CoreUILabels.AppTitle}</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <DesktopNavLink to={ROUTES.SONGS} testId={CoreTestIds.NavSongsLink}>
              {CoreUILabels.NavSongs}
            </DesktopNavLink>
            <DesktopNavLink to={ROUTES.ARTISTS} testId={CoreTestIds.NavArtistsLink}>
              {CoreUILabels.NavArtists}
            </DesktopNavLink>
            <DesktopNavLink to={ROUTES.PLAYLISTS} testId={CoreTestIds.NavPlaylistsLink}>
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
            <span className="sr-only">{CoreUILayout.OpenMainMenu}</span>
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
          <MobileNavLink to={ROUTES.SONGS} onClick={closeMobileMenu}>
            {CoreUILabels.NavSongs}
          </MobileNavLink>
          <MobileNavLink to={ROUTES.ARTISTS} onClick={closeMobileMenu}>
            {CoreUILabels.NavArtists}
          </MobileNavLink>
          <MobileNavLink to={ROUTES.PLAYLISTS} onClick={closeMobileMenu}>
            {CoreUILabels.NavPlaylists}
          </MobileNavLink>
        </MobileMenuDropdown>
      )}
    </NavbarShell>
  );
};
