// src/hooks/useTwitch.js
import { useState, useEffect } from 'react';

// Mock data for Twitch stats and streams
const MOCK_TWITCH_DATA = {
  connected: true,
  stats: {
    followers: 72400,
    subscribers: 1250,
    averageViewers: 3245,
    peakViewers: 5821,
    hoursStreamed: 342,
    lastUpdated: new Date().toISOString()
  },
  streams: [
    {
      id: 'tw001',
      title: 'Late Night Coding: Building a Dashboard UI',
      viewers: 3621,
      duration: '4h 22m',
      date: '2 days ago',
      category: 'Software & Game Development',
      thumbnail: '/images/mock/stream1.jpg'
    },
    {
      id: 'tw002',
      title: 'Let\'s Learn Next.js Together!',
      viewers: 2945,
      duration: '3h 15m',
      date: '5 days ago',
      category: 'Software & Game Development',
      thumbnail: '/images/mock/stream2.jpg'
    },
    {
      id: 'tw003',
      title: 'Chatting with Viewers While Building Cool Stuff',
      viewers: 3102,
      duration: '5h 34m',
      date: '1 week ago',
      category: 'Just Chatting',
      thumbnail: '/images/mock/stream3.jpg'
    },
    {
      id: 'tw004',
      title: 'React vs Vue: Live Coding Comparison',
      viewers: 4215,
      duration: '2h 48m',
      date: '2 weeks ago',
      category: 'Software & Game Development',
      thumbnail: '/images/mock/stream4.jpg'
    }
  ]
};

export default function useTwitch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTwitchData = async () => {
      try {
        // In a real app, this would be an API call to your backend
        // For now, we'll simulate a delay and use mock data
        setTimeout(() => {
          setData(MOCK_TWITCH_DATA);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching Twitch data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchTwitchData();
  }, []);

  return {
    connected: data?.connected || false,
    stats: data?.stats || null,
    streams: data?.streams || [],
    loading,
    error
  };
}