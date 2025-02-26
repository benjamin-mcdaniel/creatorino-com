// src/hooks/useSocialLinks.js
import { useState, useEffect, useCallback } from 'react';
import { fetchSocialLinks, addSocialLink, updateSocialLink, deleteSocialLink } from '../lib/api/social';

export default function useSocialLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load social links
  const loadLinks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSocialLinks();
      setLinks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching social links:', err);
      setError('Failed to load social links. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  // Add a new link
  const addLink = async (linkData) => {
    try {
      setLoading(true);
      const newLink = await addSocialLink(null, linkData);
      setLinks(prev => [...prev, newLink]);
      return { success: true, link: newLink };
    } catch (err) {
      console.error('Error adding social link:', err);
      setError('Failed to add social link. Please try again later.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update an existing link
  const updateLink = async (linkId, linkData) => {
    try {
      setLoading(true);
      const updatedLink = await updateSocialLink(linkId, linkData);
      setLinks(prev => prev.map(link => 
        link.id === linkId ? updatedLink : link
      ));
      return { success: true, link: updatedLink };
    } catch (err) {
      console.error('Error updating social link:', err);
      setError('Failed to update social link. Please try again later.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete a link
  const deleteLink = async (linkId) => {
    try {
      setLoading(true);
      await deleteSocialLink(linkId);
      setLinks(prev => prev.filter(link => link.id !== linkId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting social link:', err);
      setError('Failed to delete social link. Please try again later.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    links,
    loading,
    error,
    refreshLinks: loadLinks,
    addLink,
    updateLink,
    deleteLink
  };
}