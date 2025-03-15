// src/hooks/useSocialLinks.js
import { useState, useEffect } from 'react';

// Mock data for social links
const MOCK_SOCIAL_LINKS = [
  {
    id: 'sl001',
    platform: 'Twitter',
    url: 'https://twitter.com/creatorino',
    icon: 'twitter',
    clicks: 2345,
    addedDate: '2024-01-15T00:00:00Z'
  },
  {
    id: 'sl002',
    platform: 'Instagram',
    url: 'https://instagram.com/creatorino',
    icon: 'instagram',
    clicks: 1872,
    addedDate: '2024-01-17T00:00:00Z'
  },
  {
    id: 'sl003',
    platform: 'GitHub',
    url: 'https://github.com/creatorino',
    icon: 'github',
    clicks: 947,
    addedDate: '2024-02-03T00:00:00Z'
  },
  {
    id: 'sl004',
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/creatorino',
    icon: 'linkedin',
    clicks: 582,
    addedDate: '2024-02-11T00:00:00Z'
  },
  {
    id: 'sl005',
    platform: 'Personal Website',
    url: 'https://creatorino.com',
    icon: 'link',
    clicks: 3241,
    addedDate: '2024-01-10T00:00:00Z'
  }
];

export default function useSocialLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        // In a real app, this would be an API call to your backend
        // For now, we'll simulate a delay and use mock data
        setTimeout(() => {
          setLinks(MOCK_SOCIAL_LINKS);
          setLoading(false);
        }, 700);
      } catch (err) {
        console.error('Error fetching social links:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const addLink = async (linkData) => {
    // In a real app, this would call an API
    // For now, we'll just add to our state
    const newLink = {
      id: `sl${Math.floor(Math.random() * 10000)}`,
      ...linkData,
      clicks: 0,
      addedDate: new Date().toISOString()
    };
    
    setLinks([...links, newLink]);
    return newLink;
  };

  const updateLink = async (id, updates) => {
    // Update a link by ID
    const updatedLinks = links.map(link => 
      link.id === id ? { ...link, ...updates } : link
    );
    
    setLinks(updatedLinks);
    return updatedLinks.find(link => link.id === id);
  };

  const removeLink = async (id) => {
    // Remove a link by ID
    const filteredLinks = links.filter(link => link.id !== id);
    setLinks(filteredLinks);
    return true;
  };

  return {
    links,
    loading,
    error,
    addLink,
    updateLink,
    removeLink
  };
}