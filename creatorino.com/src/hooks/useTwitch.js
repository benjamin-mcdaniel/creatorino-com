// src/hooks/useTwitch.js
import { useState, useEffect } from 'react';
import { fetchTwitchStats, fetchRecentStreams, checkTwitchConnection } from '../lib/api/twitch';

export default function useTwitch() {
  const [stats, setStats] = useState(null);
  const [streams, setStreams] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTwitchData() {
      try {
        setLoading(true);
        
        // Check if Twitch is connected
        const connectionStatus = await checkTwitchConnection();
        setConnected(connectionStatus.connected);
        
        if (connectionStatus.connected) {
          // Load data in parallel
          const [statsData, streamsData] = await Promise.all([
            fetchTwitchStats(),
            fetchRecentStreams()
          ]);
          
          setStats(statsData);
          setStreams(streamsData);
        }
      } catch (err) {
        console.error('Error fetching Twitch data:', err);
        setError('Failed to load Twitch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadTwitchData();
  }, []);

  // Function to refresh data manually
  const refreshData = async () => {
    try {
      setLoading(true);
      const [statsData, streamsData] = await Promise.all([
        fetchTwitchStats(),
        fetchRecentStreams()
      ]);
      
      setStats(statsData);
      setStreams(streamsData);
      setError(null);
    } catch (err) {
      console.error('Error refreshing Twitch data:', err);
      setError('Failed to refresh data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    streams,
    connected,
    loading,
    error,
    refreshData
  };
}