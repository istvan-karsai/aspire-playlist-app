import './App.css'
import { Navbar } from './components/Navbar'
import { SongsPage } from './features/songs/pages/SongsPage'
import { ArtistsPage } from './features/artists/pages/ArtistsPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ArtistDetailsPage } from './features/artists/pages/ArtistDetailsPage';
import { PlaylistsPage } from './features/playlists/pages/PlaylistsPage';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/songs" replace />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artists/:id" element={<ArtistDetailsPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App;