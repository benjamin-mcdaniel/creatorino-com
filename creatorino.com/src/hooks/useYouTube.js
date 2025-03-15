// src/hooks/useYouTube.js
import { useState, useEffect } from 'react';

// Mock data for YouTube stats and videos
const MOCK_YOUTUBE_DATA = {
  connected: true,
  stats: {
    subscribers: 156000,
    views: 14900000,
    watchTimeHours: 685000,
    videos: 267,
    engagement: 4.7,
    lastUpdated: new Date().toISOString()
  },
  videos: [
    {
      id: 'yt001',
      title: 'How to Build a Nextjs Website in 60 Minutes',
      views: 45621,
      likes: 2456,
      comments: 167,
      published: '3 days ago',
      thumbnail: '/images/mock/video1.jpg',
      duration: '12:36'
    },
    {
      id: 'yt002',
      title: 'React Hooks Explained: useState and useEffect',
      views: 32892,
      likes: 1845,
      comments: 203,
      published: '1 week ago',
      thumbnail: '/images/mock/video2.jpg',
      duration: '18:24'
    },
    {
      id: 'yt003',
      title: 'Tailwind CSS vs Material UI: Which One Should You Choose?',
      views: 28754,
      likes: 1632,
      comments: 145,
      published: '2 weeks ago',
      thumbnail: '/images/mock/video3.jpg',
      duration: '15:08'
    },
    {
      id: 'yt004',
      title: 'Building a Modern Dashboard with React',
      views: 19543,
      likes: 1021,
      comments: 87,
      published: '3 weeks ago',
      thumbnail: '/images/mock/video4.jpg',
      duration: '22:45'
    }
  ]
};

export default function useYouTube() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYouTubeData = async () => {
      try {
        // In a real app, this would be an API call to your backend
        // For now, we'll simulate a delay and use mock data
        setTimeout(() => {
          setData(MOCK_YOUTUBE_DATA);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching YouTube data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchYouTubeData();
  }, []);

  return {
    connected: data?.connected || false,
    stats: data?.stats || null,
    videos: data?.videos || [],
    loading,
    error
  };
}