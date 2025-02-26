// src/lib/api/youtube.js
// Mock YouTube API functions

// Fetch overall YouTube channel statistics
export async function fetchYouTubeStats(channelId) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data
    return {
      subscribers: 23458,
      views: 1245689,
      watchTimeHours: 56732,
      subscribersGained: 342,
      subscribersLost: 45,
      viewsChange: 7.8, // percentage
      watchTimeChange: 6.1, // percentage
    };
  }
  
  // Fetch recent videos with performance data
  export async function fetchRecentVideos(channelId, limit = 5) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return mock data
    return [
      { 
        id: 'vid1', 
        title: "How to Grow on YouTube in 2025", 
        views: 15420, 
        likes: 1243,
        comments: 328,
        published: "2 days ago",
        thumbnail: "/api/placeholder/320/180",
        duration: "12:45"
      },
      {
        id: 'vid2', 
        title: "My New Camera Setup Tour", 
        views: 8931, 
        likes: 763,
        comments: 194,
        published: "1 week ago",
        thumbnail: "/api/placeholder/320/180",
        duration: "18:22"
      },
      { 
        id: 'vid3', 
        title: "Editing Tips for Content Creators", 
        views: 12054, 
        likes: 1089,
        comments: 276,
        published: "2 weeks ago",
        thumbnail: "/api/placeholder/320/180",
        duration: "15:03"
      }
    ];
  }
  
  // Check if YouTube is connected
  export async function checkYouTubeConnection() {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Randomly return connected or not for demo purposes
    // In a real app, this would check if the user has authorized YouTube access
    return { connected: Math.random() > 0.5 };
  }
  
  // Connect to YouTube (mock implementation)
  export async function connectYouTube() {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would redirect to YouTube OAuth
    // For now, just return success
    return { success: true };
  }