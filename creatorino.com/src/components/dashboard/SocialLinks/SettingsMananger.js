// src/lib/BrowserSettingsManager.js
import { supabase } from './supabaseClient';

/**
 * Browser Settings Manager
 * 
 * A utility class for reading and writing settings to Supabase with browser-side caching
 * to improve performance and prevent loading issues.
 */
class BrowserSettingsManager {
  constructor() {
    this.cache = {
      profile: null,
      links: null,
      lastFetched: null
    };
    
    this.user = null;
    this.loading = false;
    this.initialized = false;
    this.listeners = [];
  }

  /**
   * Initialize the manager with a user
   * @param {Object} user - The authenticated user object
   */
  init(user) {
    this.user = user;
    
    // Attempt to load from local storage first
    this._loadFromLocalStorage();
    
    return this;
  }

  /**
   * Subscribe to data changes
   * @param {Function} callback - Function to call when data changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.push(callback);
    
    // Immediately call with current data
    callback({
      profile: this.cache.profile,
      links: this.cache.links,
      loading: this.loading,
      initialized: this.initialized
    });
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify all listeners of data changes
   */
  _notifyListeners() {
    const data = {
      profile: this.cache.profile,
      links: this.cache.links,
      loading: this.loading,
      initialized: this.initialized
    };
    
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in settings listener:', error);
      }
    });
  }

  /**
   * Get settings and links for the current user
   * @param {boolean} forceRefresh - Whether to bypass cache and force a refresh
   * @returns {Promise<Object>} - The settings and links
   */
  async getSettings(forceRefresh = false) {
    // Return cached data if available and not forcing refresh
    const cacheValid = this.cache.lastFetched && 
                      (Date.now() - this.cache.lastFetched < 60000) && // 1 minute cache
                      this.cache.profile && 
                      this.cache.links;
                      
    if (!forceRefresh && cacheValid) {
      console.log('Using cached settings data');
      return {
        profile: this.cache.profile,
        links: this.cache.links
      };
    }

    if (!this.user) {
      throw new Error('User not authenticated');
    }

    this.loading = true;
    this._notifyListeners();

    try {
      // STEP 1: Get user profile with nickname
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', this.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      const nickname = profileData?.nickname || this.user.email?.split('@')[0] || '';
      console.log('User nickname:', nickname);

      // STEP 2: Get settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('social_links_settings')
        .select('*')
        .eq('user_id', this.user.id)
        .single();

      // Create settings if they don't exist
      if (settingsError && settingsError.code === 'PGRST116') {
        console.log('No settings found, creating default settings');
        
        const defaultSettings = {
          user_id: this.user.id,
          title: 'Your Name',
          bio: 'Share your story and connect with your audience.',
          theme_id: 'default',
          button_style: 'rounded',
          font_family: 'Inter',
          background_type: 'color',
          background_value: '#ffffff',
          nickname: nickname
        };
        
        const { data: newSettings, error: createError } = await supabase
          .from('social_links_settings')
          .insert(defaultSettings)
          .select();
          
        if (createError) {
          console.error('Error creating settings:', createError);
          throw createError;
        }
        
        this.cache.profile = {
          ...defaultSettings,
          id: newSettings[0].id
        };
      } else if (settingsError) {
        console.error('Error fetching settings:', settingsError);
        throw settingsError;
      } else {
        console.log('Settings fetched:', settingsData);
        
        // Parse settings into our expected format
        this.cache.profile = {
          id: settingsData.id,
          title: settingsData.title || 'Your Name',
          bio: settingsData.bio || '',
          themeId: settingsData.theme_id || 'default',
          button_style: settingsData.button_style || 'rounded',
          font_family: settingsData.font_family || 'Inter',
          background_type: settingsData.background_type || 'color',
          background_value: settingsData.background_value || '#ffffff',
          nickname: nickname
        };
      }

      // STEP 3: Get links
      let fetchedLinks = [];
      
      // First try by nickname
      if (nickname) {
        const { data: nicknameLinks, error: nicknameError } = await supabase
          .from('social_links')
          .select('*')
          .eq('nickname', nickname)
          .order('sort_order');
          
        if (!nicknameError && nicknameLinks && nicknameLinks.length > 0) {
          console.log(`Found ${nicknameLinks.length} links by nickname`);
          fetchedLinks = nicknameLinks;
        } else {
          console.log('No links found by nickname, trying user_id');
          
          // Fall back to user_id
          const { data: userLinks, error: userLinksError } = await supabase
            .from('social_links')
            .select('*')
            .eq('user_id', this.user.id)
            .order('sort_order');
            
          if (!userLinksError && userLinks && userLinks.length > 0) {
            console.log(`Found ${userLinks.length} links by user_id`);
            fetchedLinks = userLinks;
          } else if (userLinksError) {
            console.error('Error fetching links by user_id:', userLinksError);
            throw userLinksError;
          } else {
            console.log('No links found for user');
          }
        }
      } else {
        // No nickname, try user_id directly
        const { data: userLinks, error: userLinksError } = await supabase
          .from('social_links')
          .select('*')
          .eq('user_id', this.user.id)
          .order('sort_order');
          
        if (!userLinksError && userLinks && userLinks.length > 0) {
          console.log(`Found ${userLinks.length} links by user_id`);
          fetchedLinks = userLinks;
        } else if (userLinksError) {
          console.error('Error fetching links by user_id:', userLinksError);
          throw userLinksError;
        } else {
          console.log('No links found for user');
        }
      }
      
      // Create a default link if none found
      if (fetchedLinks.length === 0) {
        console.log('No links found, creating default link');
        
        const defaultLink = {
          user_id: this.user.id,
          title: 'My Website',
          url: 'https://example.com',
          platform_key: '',
          description: 'My personal website',
          sort_order: 0,
          nickname: nickname
        };
        
        const { data: newLink, error: createLinkError } = await supabase
          .from('social_links')
          .insert(defaultLink)
          .select();
          
        if (createLinkError) {
          console.error('Error creating default link:', createLinkError);
          throw createLinkError;
        }
        
        fetchedLinks = newLink;
      }

      // Update cache
      this.cache.links = fetchedLinks;
      this.cache.lastFetched = Date.now();
      this.initialized = true;
      
      // Save to local storage
      this._saveToLocalStorage();
      
      // Return the data
      return {
        profile: this.cache.profile,
        links: this.cache.links
      };
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    } finally {
      this.loading = false;
      this._notifyListeners();
    }
  }

  /**
   * Update profile settings
   * @param {Object} newData - The new profile data
   * @returns {Promise<Object>} - The updated profile
   */
  async updateProfile(newData) {
    if (!this.user) {
      throw new Error('User not authenticated');
    }

    this.loading = true;
    this._notifyListeners();

    try {
      // Map front-end property names to database column names
      const mappedData = {};
      
      if ('title' in newData) mappedData.title = newData.title;
      if ('bio' in newData) mappedData.bio = newData.bio;
      if ('themeId' in newData) mappedData.theme_id = newData.themeId;
      if ('button_style' in newData) mappedData.button_style = newData.button_style;
      if ('font_family' in newData) mappedData.font_family = newData.font_family;
      if ('background_type' in newData) mappedData.background_type = newData.background_type;
      if ('background_value' in newData) mappedData.background_value = newData.background_value;
      
      mappedData.updated_at = new Date();

      // Update in database
      const { data, error } = await supabase
        .from('social_links_settings')
        .update(mappedData)
        .eq('user_id', this.user.id)
        .select();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      // Update cache
      this.cache.profile = {
        ...this.cache.profile,
        ...newData
      };
      
      this.cache.lastFetched = Date.now();
      
      // Save to local storage
      this._saveToLocalStorage();
      
      // Return the updated profile
      return this.cache.profile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      this.loading = false;
      this._notifyListeners();
    }
  }

  /**
   * Add a new link
   * @param {Object} linkData - The link data to add
   * @returns {Promise<Object>} - The newly created link
   */
  async addLink(linkData) {
    if (!this.user) {
      throw new Error('User not authenticated');
    }

    this.loading = true;
    this._notifyListeners();

    try {
      // Create the new link data
      const newLink = {
        user_id: this.user.id,
        title: linkData.title,
        url: linkData.url,
        platform_key: linkData.platform_key || '',
        description: linkData.description || '',
        sort_order: this.cache.links ? this.cache.links.length : 0,
        nickname: this.cache.profile?.nickname || ''
      };

      // Add to database
      const { data, error } = await supabase
        .from('social_links')
        .insert(newLink)
        .select();

      if (error) {
        console.error('Error adding link:', error);
        throw error;
      }

      // Update cache
      if (!this.cache.links) {
        this.cache.links = [];
      }
      
      this.cache.links = [...this.cache.links, data[0]];
      this.cache.lastFetched = Date.now();
      
      // Save to local storage
      this._saveToLocalStorage();
      
      // Return the newly created link
      return data[0];
    } catch (error) {
      console.error('Error adding link:', error);
      throw error;
    } finally {
      this.loading = false;
      this._notifyListeners();
    }
  }

  /**
   * Update an existing link
   * @param {string} id - The link ID to update
   * @param {Object} linkData - The new link data
   * @returns {Promise<Object>} - The updated link
   */
  async updateLink(id, linkData) {
    if (!this.user) {
      throw new Error('User not authenticated');
    }

    this.loading = true;
    this._notifyListeners();

    try {
      // Create the update data
      const updateData = {
        title: linkData.title,
        url: linkData.url,
        platform_key: linkData.platform_key || '',
        description: linkData.description || '',
        updated_at: new Date()
      };

      // Update in database
      const { data, error } = await supabase
        .from('social_links')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating link:', error);
        throw error;
      }

      // Update cache
      if (this.cache.links) {
        this.cache.links = this.cache.links.map(link => 
          link.id === id ? data[0] : link
        );
      }
      
      this.cache.lastFetched = Date.now();
      
      // Save to local storage
      this._saveToLocalStorage();
      
      // Return the updated link
      return data[0];
    } catch (error) {
      console.error('Error updating link:', error);
      throw error;
    } finally {
      this.loading = false;
      this._notifyListeners();
    }
  }

  /**
   * Delete a link
   * @param {string} id - The link ID to delete
   * @returns {Promise<void>}
   */
  async deleteLink(id) {
    if (!this.user) {
      throw new Error('User not authenticated');
    }

    this.loading = true;
    this._notifyListeners();

    try {
      // Delete from database
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting link:', error);
        throw error;
      }

      // Update cache
      if (this.cache.links) {
        this.cache.links = this.cache.links.filter(link => link.id !== id);
        
        // Update sort order of remaining links
        this.cache.links = this.cache.links.map((link, index) => ({
          ...link,
          sort_order: index
        }));
        
        // Update sort order in database
        for (const link of this.cache.links) {
          await supabase
            .from('social_links')
            .update({ sort_order: link.sort_order })
            .eq('id', link.id);
        }
      }
      
      this.cache.lastFetched = Date.now();
      
      // Save to local storage
      this._saveToLocalStorage();
    } catch (error) {
      console.error('Error deleting link:', error);
      throw error;
    } finally {
      this.loading = false;
      this._notifyListeners();
    }
  }

  /**
   * Get the public link URL
   * @returns {string} - The public link URL
   */
  getPublicLinkUrl() {
    const nickname = this.cache.profile?.nickname ||
                    (this.user?.email ? this.user.email.split('@')[0] : '');
                    
    return `/s/${nickname}`;
  }

  /**
   * Save the current cache to local storage
   * @private
   */
  _saveToLocalStorage() {
    try {
      if (!this.user) return;
      
      const storageKey = `social_links_${this.user.id}`;
      const data = {
        profile: this.cache.profile,
        links: this.cache.links,
        lastFetched: this.cache.lastFetched,
        version: 1 // For future migrations
      };
      
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }

  /**
   * Load data from local storage
   * @private
   */
  _loadFromLocalStorage() {
    try {
      if (!this.user) return;
      
      const storageKey = `social_links_${this.user.id}`;
      const storedData = localStorage.getItem(storageKey);
      
      if (!storedData) return;
      
      const data = JSON.parse(storedData);
      
      // Version check for future migrations
      if (data.version !== 1) return;
      
      this.cache.profile = data.profile;
      this.cache.links = data.links;
      this.cache.lastFetched = data.lastFetched;
      
      // Don't use data older than 1 hour
      if (Date.now() - this.cache.lastFetched > 3600000) {
        this.cache.profile = null;
        this.cache.links = null;
        this.cache.lastFetched = null;
        return;
      }
      
      this.initialized = true;
      this._notifyListeners();
      console.log('Loaded settings from local storage');
    } catch (error) {
      console.error('Error loading from local storage:', error);
    }
  }

  /**
   * Clear the cache and local storage
   */
  clearCache() {
    if (!this.user) return;
    
    const storageKey = `social_links_${this.user.id}`;
    localStorage.removeItem(storageKey);
    
    this.cache.profile = null;
    this.cache.links = null;
    this.cache.lastFetched = null;
    
    this._notifyListeners();
  }
}

// Create a singleton instance
const settingsManager = new BrowserSettingsManager();

export default settingsManager;