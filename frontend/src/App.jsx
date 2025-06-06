import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SearchPage from './components/SearchPage'
import CreatorProfile from './components/CreatorProfile'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Creatorino</h1>
        <p>Discover Content Creators Across Platforms</p>
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/creator/:platform/:id" element={<CreatorProfile />} />
        </Routes>
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2025 Creatorino - Content Creator Discovery Platform</p>
      </footer>
    </div>
  )
}

export default App
