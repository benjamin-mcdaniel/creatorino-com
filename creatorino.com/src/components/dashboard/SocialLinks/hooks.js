// src/components/dashboard/SocialLinks/hooks.js
import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { detectPlatformFromUrl, PLATFORM_OPTIONS } from './utils';

/**
 * Custom hook for managing social links
 * @param {Object} user - Current authenticated user
 * @returns {Object} - State and functions for managing social links
 */
const useSocialLinksManager = (user) => {
  // Core state
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [profile, setProfile] = useState({
    title: 'Your Name',
    bio: 'Your bio goes here',
    themeId: 'default',
    button_style: 'rounded',
    font_family: 'Inter',
    background_type: 'color',
    background_value: '#ffffff',
    nickname: '' // Added nickname to track it in state
  });
  
  // UI state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    platform_key: '',
    description: ''
  });
  
  // Track if initialization has been attempted
  const [initialized, setInitialized] = useState(false);

  // Use refs to avoid unnecessary re-renders
  const userRef = useRef(user);
  const linksRef = useRef(links);
  const profileRef = useRef(profile);
  
  // Update refs when state changes
  useEffect(() => {
    userRef.current = user;
  }, [user]);
  
  useEffect(() => {
    linksRef.current = links;
  }, [links]);
  
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  /**
   * Show a notification message
   * @param {string} message - Message to display
   * @param {string} severity - Severity level (success, error, info, warning)
   */
  const showNotification = useCallback((message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  }, []);

  /**
   * Close the notification
   */
  const closeNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  /**
   * Initialize user settings and links if they don't exist
   */
  const initializeSettings = useCallback(async () => {
    if (!userRef.current) return;
    
    try {
      console.log('Initializing user settings...');
      
      // Get user's nickname
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', userRef.current.id)
        .single();
        
      if (profileError) {
        console.error('Error getting profile:', profileError);
        throw profileError;
      }
      
      const nickname = profileData?.nickname || userRef.current.email?.split('@')[0] || '';
      console.log('User nickname:', nickname);
      
      // Store nickname in state for later use
      setProfile(prev => ({
        ...prev,
        nickname: nickname
      }));
      
      // Check if settings already exist
      const { data: existingSettings, error: settingsCheckError } = await supabase
        .from('social_links_settings')
        .select('id')
        .eq('user_id', userRef.current.id)
        .single();
      
      if (settingsCheckError && settingsCheckError.code !== 'PGRST116') {
        console.error('Error checking settings:', settingsCheckError);
      }
      
      const hasSettings = !!existingSettings;
      console.log('User has existing settings:', hasSettings);
      
      // Create settings if they don't exist
      if (!hasSettings) {
        console.log('Creating settings for user...');
        const { error: createError } = await supabase
          .from('social_links_settings')
          .insert({
            user_id: userRef.current.id,
            title: 'Your Name',
            bio: 'Share your story and connect with your audience.',
            theme_id: 'default',
            button_style: 'rounded',
            font_family: 'Inter',
            background_type: 'color',
            background_value: '#ffffff',
            nickname: nickname
          });
          
        if (createError) {
          console.error('Error creating settings:', createError);
          throw createError;
        } else {
          console.log('Settings created successfully');
        }
      }
      
      // Check if links already exist
      const { data: existingLinks, error: linksCheckError } = await supabase
        .from('social_links')
        .select('id')
        .eq('user_id', userRef.current.id)
        .maybeSingle();
        
      if (linksCheckError && linksCheckError.code !== 'PGRST116') {
        console.error('Error checking links:', linksCheckError);
      }
      
      const hasLinks = !!existingLinks;
      console.log('User has existing links:', hasLinks);
      
      // Create a default link if none exist
      if (!hasLinks) {
        console.log('Creating default link for user...');
        const { error: linkError } = await supabase
          .from('social_links')
          .insert({
            user_id: userRef.current.id,
            title: 'My Website',
            url: 'https://example.com',
            platform_key: '',
            description: 'My personal website',
            sort_order: 0,
            nickname: nickname
          });
          
        if (linkError) {
          console.error('Error creating default link:', linkError);
          throw linkError;
        } else {
          console.log('Default link created successfully');
        }
      }
      
      setInitialized(true);
      console.log('Initialization complete');
    } catch (error) {
      console.error('Error in initialization:', error);
      throw error; // Re-throw to ensure promise chain stops
    }
  }, []);

  /**
   * Fetch user's social links and settings
   */
  const fetchUserData = useCallback(async () => {
    if (!userRef.current) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching user data...');
      
      // Get user's nickname
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', userRef.current.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }
      
      const nickname = profileData?.nickname || '';
      console.log('User nickname:', nickname);
      
      // Store nickname in state for later use
      setProfile(prev => ({
        ...prev,
        nickname: nickname
      }));
      
      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('social_links_settings')
        .select('*')
        .eq('user_id', userRef.current.id)
        .single();
        
      if (settingsError) {
        console.error('Error fetching settings:', settingsError);
        throw settingsError;
      } else if (settingsData) {
        console.log('Found settings:', settingsData);
        setProfile(prev => ({
          ...prev,
          title: settingsData.title || 'Your Name',
          bio: settingsData.bio || '',
          themeId: settingsData.theme_id || 'default',
          button_style: settingsData.button_style || 'rounded',
          font_family: settingsData.font_family || 'Inter',
          background_type: settingsData.background_type || 'color',
          background_value: settingsData.background_value || '#ffffff'
        }));
      }
      
      // Fetch links by nickname if available
      let fetchedLinks = [];
      if (nickname) {
        console.log('Fetching links by nickname:', nickname);
        
        // Wait for the links to load
        const { data: nicknameLinks, error: nicknameError } = await supabase
          .from('social_links')
          .select('*')
          .eq('nickname', nickname)
          .order('sort_order');
          
        if (nicknameError) {
          console.error('Error fetching links by nickname:', nicknameError);
        } else if (nicknameLinks && nicknameLinks.length > 0) {
          console.log(`Found ${nicknameLinks.length} links by nickname`);
          fetchedLinks = nicknameLinks;
        } else {
          console.log('No links found by nickname');
        }
      }
      
      // If no links found by nickname, try by user_id
      if (fetchedLinks.length === 0) {
        console.log('Fetching links by user_id');
        const { data: userLinks, error: userLinksError } = await supabase
          .from('social_links')
          .select('*')
          .eq('user_id', userRef.current.id)
          .order('sort_order');
          
        if (userLinksError) {
          console.error('Error fetching links by user_id:', userLinksError);
          throw userLinksError;
        } else if (userLinks && userLinks.length > 0) {
          console.log(`Found ${userLinks.length} links by user_id`);
          fetchedLinks = userLinks;
        } else {
          console.log('No links found by user_id');
        }
      }
      
      // Update state with found links
      console.log('Setting links state:', fetchedLinks);
      setLinks(fetchedLinks);
      
      // Ensure we have links before setting loading to false
      // Short delay to ensure state updates are processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error; // Re-throw error to propagate to caller
    }
  }, []);

  /**
   * Get the URL for the public page
   * FIXED: Now properly uses the stored nickname from state
   * @returns {string} - Public page URL
   */
  const getPublicLinkUrl = useCallback(() => {
    if (!userRef.current) return '#';
    
    // Use the nickname stored in profile state
    const nickname = profileRef.current.nickname || 
                    (userRef.current.email ? userRef.current.email.split('@')[0] : '');
    
    return `/s/${nickname}`;
  }, []);
  
  /**
   * Add a new social link
   * @param {Object} linkData - Link data to add
   */
  const addLink = useCallback(async (linkData) => {
    try {
      if (!userRef.current) {
        showNotification('You must be logged in to manage social links', 'error');
        return;
      }
      
      const currentLinks = linksRef.current;
      
      // Use the nickname from state
      const nickname = profileRef.current.nickname || '';
      
      const newLink = {
        user_id: userRef.current.id,
        title: linkData.title,
        url: linkData.url,
        platform_key: linkData.platform_key || '',
        description: linkData.description || '',
        sort_order: currentLinks.length,
        nickname: nickname
      };
      
      console.log('Adding new link:', newLink);
      const { data, error } = await supabase
        .from('social_links')
        .insert(newLink)
        .select();
      
      if (error) {
        console.error('Error adding link:', error);
        showNotification('Error adding link: ' + error.message, 'error');
        return;
      }
      
      console.log('Link added successfully:', data);
      setLinks([...currentLinks, data[0]]);
      showNotification('Link added successfully');
    } catch (error) {
      console.error('Error in addLink:', error);
      showNotification('An unexpected error occurred', 'error');
    }
  }, [showNotification]);
  
  /**
   * Update an existing link
   * @param {string} id - Link ID to update
   * @param {Object} linkData - New link data
   */
  const updateLink = useCallback(async (id, linkData) => {
    try {
      console.log('Updating link with ID:', id, linkData);
      const { data, error } = await supabase
        .from('social_links')
        .update({
          title: linkData.title,
          url: linkData.url,
          platform_key: linkData.platform_key || '',
          description: linkData.description || '',
          updated_at: new Date()
        })
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating link:', error);
        showNotification('Error updating link: ' + error.message, 'error');
        return;
      }
      
      console.log('Link updated successfully:', data);
      const currentLinks = linksRef.current;
      setLinks(currentLinks.map(link => 
        link.id === id ? data[0] : link
      ));
      showNotification('Link updated successfully');
    } catch (error) {
      console.error('Error in updateLink:', error);
      showNotification('An unexpected error occurred', 'error');
    }
  }, [showNotification]);
  
  /**
   * Delete a link
   * @param {string} id - Link ID to delete
   */
  const deleteLink = useCallback(async (id) => {
    try {
      console.log('Deleting link with ID:', id);
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting link:', error);
        showNotification('Error deleting link: ' + error.message, 'error');
        return;
      }
      
      console.log('Link deleted successfully');
      const currentLinks = linksRef.current;
      setLinks(currentLinks.filter(link => link.id !== id));
      showNotification('Link deleted successfully');
      
      // Update sort order for remaining links
      const updatedLinks = currentLinks
        .filter(link => link.id !== id)
        .map((link, index) => ({
          ...link,
          sort_order: index
        }));
        
      console.log('Updating sort order for remaining links');
      for (const link of updatedLinks) {
        await supabase
          .from('social_links')
          .update({ sort_order: link.sort_order })
          .eq('id', link.id);
      }
    } catch (error) {
      console.error('Error in deleteLink:', error);
      showNotification('An unexpected error occurred', 'error');
    }
  }, [showNotification]);
  
  /**
   * Update profile settings
   * @param {Object} newData - New profile data
   */
  const updateProfile = useCallback(async (newData) => {
    try {
      console.log('Updating profile settings:', newData);
      setProfile(prev => ({...prev, ...newData}));
      
      if (!userRef.current) {
        return;
      }
      
      const mappedData = {};
      
      // Map front-end property names to database column names
      if ('title' in newData) mappedData.title = newData.title;
      if ('bio' in newData) mappedData.bio = newData.bio;
      if ('themeId' in newData) mappedData.theme_id = newData.themeId;
      if ('button_style' in newData) mappedData.button_style = newData.button_style;
      if ('font_family' in newData) mappedData.font_family = newData.font_family;
      if ('background_type' in newData) mappedData.background_type = newData.background_type;
      if ('background_value' in newData) mappedData.background_value = newData.background_value;
      
      mappedData.updated_at = new Date();
      
      console.log('Sending mapped profile data to database:', mappedData);
      const { error } = await supabase
        .from('social_links_settings')
        .update(mappedData)
        .eq('user_id', userRef.current.id);
      
      if (error) {
        console.error('Error updating profile:', error);
        showNotification('Error saving settings: ' + error.message, 'error');
      } else {
        console.log('Profile updated successfully');
        showNotification('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error in updateProfile:', error);
      showNotification('An unexpected error occurred', 'error');
    }
  }, [showNotification]);
  
  /**
   * Open dialog to add a new link
   */
  const handleAddNew = useCallback(() => {
    setCurrentLink(null);
    setFormData({ title: '', url: '', platform_key: '', description: '' });
    setDialogOpen(true);
  }, []);
  
  /**
   * Open dialog to edit an existing link
   * @param {Object} link - Link to edit
   */
  const handleEdit = useCallback((link) => {
    setCurrentLink(link);
    setFormData({
      title: link.title || '',
      url: link.url || '',
      platform_key: link.platform_key || '',
      description: link.description || ''
    });
    setDialogOpen(true);
  }, []);
  
  /**
   * Handle form field changes
   * @param {Object} e - Event object
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      
      // Auto-populate title based on platform selection
      if (name === 'platform_key' && value) {
        const platform = PLATFORM_OPTIONS.find(p => p.key === value);
        if (platform && !prev.title) {
          updatedData.title = platform.name;
        }
      }
      
      // Auto-detect platform from URL
      if (name === 'url' && value && !prev.platform_key) {
        const detectedPlatform = detectPlatformFromUrl(value);
        if (detectedPlatform) {
          updatedData.platform_key = detectedPlatform;
        }
      }
      
      return updatedData;
    });
  }, []);
  
  /**
   * Handle changes to profile fields
   * @param {Object} e - Event object
   */
  const handleProfileChange = useCallback((e) => {
    const { name, value } = e.target;
    updateProfile({ [name]: value });
  }, [updateProfile]);
  
  /**
   * Submit the form to add or update a link
   */
  const handleSubmit = useCallback(() => {
    if (currentLink) {
      updateLink(currentLink.id, formData);
    } else {
      addLink(formData);
    }
    setDialogOpen(false);
  }, [currentLink, formData, addLink, updateLink]);
  
  /**
   * Force refresh the data
   */
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      await initializeSettings();
      await fetchUserData();
      showNotification('Data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing data:', error);
      showNotification('Error refreshing data', 'error');
    } finally {
      setLoading(false);
    }
  }, [initializeSettings, fetchUserData, showNotification]);

  // Initialize on component mount - FIXED to use async/await pattern
  useEffect(() => {
    const loadData = async () => {
      if (!userRef.current) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        console.log('Component mounted, initializing...');
        await initializeSettings();
        console.log('Initialization complete, fetching data...');
        await fetchUserData();
        console.log('Data loading complete');
      } catch (error) {
        console.error('Error in initialization process:', error);
        showNotification('Error loading data. Please try refreshing.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [initializeSettings, fetchUserData, showNotification]);

  // This additional effect runs when any dependencies change and makes sure we refresh data
  // when necessary (important for re-fetching links after adding the first one)
  useEffect(() => {
    if (!loading && links.length === 0 && initialized) {
      console.log('No links found after initialization. Retrying fetch...');
      fetchUserData().catch(err => {
        console.error('Error in automatic retry:', err);
      });
    }
  }, [loading, links, initialized, fetchUserData]);

  return {
    loading,
    links,
    profile,
    notification,
    dialogOpen,
    currentLink,
    formData,
    refreshData,
    addLink,
    updateLink,
    deleteLink,
    updateProfile,
    showNotification,
    closeNotification,
    handleAddNew,
    handleEdit,
    handleChange,
    handleProfileChange,
    handleSubmit,
    setDialogOpen,
    getPublicLinkUrl
  };
};

export { useSocialLinksManager };