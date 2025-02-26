// src/lib/api/social.js
// Mock Social Links API functions

// Fetch user's social links
export async function fetchSocialLinks(userId) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return [
      { 
        id: '1', 
        platform: "Twitter", 
        username: "@creatorino", 
        url: "https://twitter.com/creatorino",
        followers: 5640,
        followersChange: 3.2, // percentage
        icon: "Twitter" 
      },
      { 
        id: '2', 
        platform: "Instagram", 
        username: "@creatorino.official", 
        url: "https://instagram.com/creatorino.official",
        followers: 8950,
        followersChange: 5.7, // percentage
        icon: "Instagram" 
      },
      { 
        id: '3', 
        platform: "TikTok", 
        username: "@creatorino", 
        url: "https://tiktok.com/@creatorino",
        followers: 12300,
        followersChange: 8.4, // percentage
        icon: "TikTok" 
      }
    ];
  }
  
  // Add a new social link
  export async function addSocialLink(userId, linkData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would save to a database
    return {
      id: Math.random().toString(36).substring(7),
      ...linkData,
      followers: 0,
      followersChange: 0,
    };
  }
  
  // Update an existing social link
  export async function updateSocialLink(linkId, linkData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would update a database record
    return {
      id: linkId,
      ...linkData,
    };
  }
  
  // Delete a social link
  export async function deleteSocialLink(linkId) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would delete from a database
    return { success: true };
  }