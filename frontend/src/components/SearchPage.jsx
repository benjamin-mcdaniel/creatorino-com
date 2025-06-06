import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = 'https://creatorino-api.benjamin-f-mcdaniel.workers.dev' // This will be updated automatically during deployment

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [liveResults, setLiveResults] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showLiveSearch, setShowLiveSearch] = useState(false)
  const navigate = useNavigate()

  // Live search for cached results
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.length > 1) {
        performLiveSearch(searchTerm)
      } else {
        setLiveResults([])
        setShowLiveSearch(false)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const performLiveSearch = async (query) => {
    try {
      const response = await fetch(`${API_BASE}/api/search/live?q=${encodeURIComponent(query)}&limit=10`)
      const data = await response.json()
      setLiveResults(data.creators || [])
      setShowLiveSearch(data.creators?.length > 0)
    } catch (error) {
      console.error('Live search error:', error)
      setLiveResults([])
      setShowLiveSearch(false)
    }
  }

  const performAdvancedSearch = async (query, page = 1) => {
    setIsSearching(true)
    try {
      const response = await fetch(`${API_BASE}/api/search/advanced?q=${encodeURIComponent(query)}&page=${page}&limit=25`)
      const data = await response.json()
      setSearchResults(data.results || [])
      setCurrentPage(page)
      setShowLiveSearch(false)
    } catch (error) {
      console.error('Advanced search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      performAdvancedSearch(searchTerm.trim())
    }
  }

  const handleCreatorClick = (creator) => {
    navigate(`/creator/${creator.platform}/${creator.id}`)
  }

  const formatSubscriberCount = (count) => {
    if (!count) return 'Unknown'
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  return (
    <div className="search-page">
      <form onSubmit={handleSearchSubmit} className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for YouTube or Twitch creators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowLiveSearch(liveResults.length > 0)}
          onBlur={() => setTimeout(() => setShowLiveSearch(false), 200)}
        />
        
        {showLiveSearch && (
          <div className="live-search-dropdown">
            {liveResults.map((creator) => (
              <div
                key={`${creator.platform}-${creator.id}`}
                className="dropdown-item"
                onClick={() => handleCreatorClick(creator)}
              >
                <img src={creator.thumbnail || '/default-avatar.png'} alt={creator.name} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{creator.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    {creator.platform.toUpperCase()} • {formatSubscriberCount(creator.subscribers)} subscribers
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>

      {liveResults.length === 0 && searchTerm.length > 1 && !isSearching && (
        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.9)', borderRadius: '10px', marginBottom: '1rem' }}>
          <p>No cached results found. Try an advanced search to find new creators!</p>
          <button
            onClick={() => performAdvancedSearch(searchTerm)}
            style={{
              padding: '0.5rem 1rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '0.5rem'
            }}
          >
            Advanced Search
          </button>
        </div>
      )}

      {isSearching && (
        <div className="loading">
          <p>Searching across platforms...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((creator, index) => (
            <div
              key={`${creator.platform}-${creator.id}-${index}`}
              className="result-card"
              onClick={() => handleCreatorClick(creator)}
            >
              <img src={creator.thumbnail || '/default-avatar.png'} alt={creator.name} />
              <h3>{creator.name}</h3>
              <p>{creator.description}</p>
              <span className="platform-badge">{creator.platform.toUpperCase()}</span>
              {creator.subscribers && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  {formatSubscriberCount(creator.subscribers)} subscribers
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => performAdvancedSearch(searchTerm, currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={() => performAdvancedSearch(searchTerm, currentPage + 1)}
            disabled={searchResults.length < 25}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchPage








