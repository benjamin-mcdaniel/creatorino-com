// src/hooks/useYouTube.js
import { useState, useEffect } from 'react';
import { fetchYouTubeStats, fetchRecentVideos, checkYouTubeConnection } from '../lib/api/youtube';

export default function useYouTube() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadYouTubeData() {
      try {
        setLoading(true);
        
        // Check if YouTube is connected
        const connectionStatus = await checkYouTubeConnection();
        setConnected(connectionStatus.connected);
        
        if (connectionStatus.connected) {
          // Load data in parallel
          const [statsData, videosData] = await Promise.all([
            fetchYouTubeStats(),
            fetchRecentVideos()
          ]);
          
          setStats(statsData);
          setVideos(videosData);
        }
      } catch (err) {
        console.error('Error fetching YouTube data:', err);
        setError('Failed to load YouTube data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadYouTubeData();
  }, []);

  // Function to refresh data manually
  const refreshData = async () => {
    try {
      setLoading(true);
      const [statsData, videosData] = await Promise.all([
        fetchYouTubeStats(),
        fetchRecentVideos()
      ]);
      
      setStats(statsData);
      setVideos(videosData);
      setError(null);
    } catch (err) {
      console.error('Error refreshing YouTube data:', err);
      setError('Failed to refresh data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    videos,
    connected,
    loading,
    error,
    refreshData
  };
}