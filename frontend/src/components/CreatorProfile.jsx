import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API_BASE = 'https://creatorino-api.benjamin-f-mcdaniel.workers.dev' // This will be updated automatically during deployment

function CreatorProfile() {
  const { platform, id } = useParams()
  const navigate = useNavigate()
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCreatorProfile()
  }, [platform, id])

  const fetchCreatorProfile = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE}/api/creator/${platform}/${id}`)
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setCreator(data.creator)
      }
    } catch (err) {
      setError('Failed to load creator profile. Please try again.')
      console.error('Profile fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num) => {
    if (!num) return 'N/A'
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const getPlatformColor = (platformName) => {
    switch (platformName.toLowerCase()) {
      case 'youtube': return '#FF0000'
      case 'twitch': return '#9146FF'
      case 'twitter': return '#1DA1F2'
      case 'instagram': return '#E4405F'
      case 'tiktok': return '#000000'
      default: return '#667eea'
    }
  }

  const detectPlatform = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
    if (url.includes('twitch.tv')) return 'Twitch'
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter'
    if (url.includes('instagram.com')) return 'Instagram'
    if (url.includes('tiktok.com')) return 'TikTok'
    return 'Website'
  }

  if (loading) {
    return <div className="loading">Loading creator profile...</div>
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Back to Search
        </button>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="error">
        <p>Creator not found</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Back to Search
        </button>
      </div>
    )
  }

  return (
    <div className="creator-profile">
      <button 
        onClick={() => navigate('/')}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          background: 'white',
          border: '2px solid #667eea',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ← Back to Search
      </button>

      <div className="profile-header">
        {creator.banner && (
          <img src={creator.banner} alt="Profile Banner" className="profile-banner" />
        )}
        
        <div className="profile-content">
          <img 
            src={creator.thumbnail || '/default-avatar.png'} 
            alt={creator.name} 
            className="profile-avatar"
          />
          
          <div className="profile-info">
            <h1>{creator.name}</h1>
            {creator.verified && (
              <span style={{ 
                background: '#10B981', 
                color: 'white', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '10px', 
                fontSize: '0.8rem',
                marginLeft: '0.5rem'
              }}>
                Verified
              </span>
            )}
            
            <div className="profile-stats">
              {creator.subscribers && (
                <div className="stat">
                  <div className="stat-number">{formatNumber(creator.subscribers)}</div>
                  <div className="stat-label">Subscribers</div>
                </div>
              )}
              
              {creator.videos && (
                <div className="stat">
                  <div className="stat-number">{formatNumber(creator.videos)}</div>
                  <div className="stat-label">Videos</div>
                </div>
              )}
              
              {creator.views && (
                <div className="stat">
                  <div className="stat-number">{formatNumber(creator.views)}</div>
                  <div className="stat-label">Total Views</div>
                </div>
              )}

              {creator.followers && (
                <div className="stat">
                  <div className="stat-number">{formatNumber(creator.followers)}</div>
                  <div className="stat-label">Followers</div>
                </div>
              )}
            </div>

            <div style={{ 
              background: getPlatformColor(creator.platform), 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '20px', 
              display: 'inline-block',
              marginTop: '1rem'
            }}>
              {creator.platform.toUpperCase()}
            </div>
            
            {creator.description && (
              <p style={{ 
                marginTop: '1rem', 
                lineHeight: '1.6', 
                maxWidth: '600px',
                color: '#4a5568'
              }}>
                {creator.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Cross-platform links section */}
      {creator.crossPlatformData && creator.crossPlatformData.length > 0 && (
        <div className="cross-platform-links">
          <h3>Other Platforms</h3>
          {creator.crossPlatformData.map((platformData, index) => (
            <a
              key={index}
              href={platformData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-link"
              style={{ borderLeft: `4px solid ${getPlatformColor(platformData.platform)}` }}
            >
              <div>
                <strong>{platformData.name}</strong>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {platformData.platform.toUpperCase()}
                  {platformData.subscribers && ` • ${formatNumber(platformData.subscribers)} subscribers`}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* External links from description */}
      {creator.links && creator.links.length > 0 && (
        <div className="cross-platform-links" style={{ marginTop: '1rem' }}>
          <h3>External Links</h3>
          {creator.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-link"
              style={{ borderLeft: `4px solid ${getPlatformColor(link.platform)}` }}
            >
              <div>
                <strong>{detectPlatform(link.url)}</strong>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  {link.url}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default CreatorProfile








