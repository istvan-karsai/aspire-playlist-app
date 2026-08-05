import { useState } from 'react';
import './App.css'
import { Navbar } from './components/Navbar'
import { SongsPage } from './pages/SongsPage'
import { ArtistsPage } from './pages/ArtistsPage';
import type { ViewState } from './types/navigation';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('songs');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {currentView === 'songs' && <SongsPage />}
        {currentView === 'artists' && <ArtistsPage />}
        {/* TODO: Implement Playlists view */}
      </main>
    </div>
  )
}

export default App
