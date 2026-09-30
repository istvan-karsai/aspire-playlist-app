import { Navbar } from './components/layout/Navbar';
import { SongsPage } from './features/songs/pages/SongsPage';
import { ArtistsPage } from './features/artists/pages/ArtistsPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ArtistDetailsPage } from './features/artists/pages/ArtistDetailsPage';
import { PlaylistsPage } from './features/playlists/pages/PlaylistsPage';
import { Footer } from './components/layout/Footer';
import { PlaylistDetailsPage } from './features/playlists/pages/PlaylistDetailsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SongDetailsPage } from './features/songs/pages/SongDetailsPage';
import { ROUTES } from './core/constants/routes';

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.SONGS} replace />} />
          <Route path={ROUTES.SONGS} element={<SongsPage />} />
          <Route path={`${ROUTES.SONGS}/:id`} element={<SongDetailsPage />} />
          <Route path={ROUTES.ARTISTS} element={<ArtistsPage />} />
          <Route path={`${ROUTES.ARTISTS}/:id`} element={<ArtistDetailsPage />} />
          <Route path={ROUTES.PLAYLISTS} element={<PlaylistsPage />} />
          <Route path={`${ROUTES.PLAYLISTS}/:id`} element={<PlaylistDetailsPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
