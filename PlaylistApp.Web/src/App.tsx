import './App.css'
import { Navbar } from './components/Navbar'
import { SongsPage } from './pages/SongsPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <SongsPage />
      </main>
    </div>
  )
}

export default App
