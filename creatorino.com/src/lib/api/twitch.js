// src/lib/api/twitch.js
// Mock Twitch API functions

// Fetch overall Twitch channel statistics
export async function fetchTwitchStats(username) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data
    return {
      followers: 12543,
      subscribers: 432,
      viewerHours: 18432,
      averageViewers: 867,
      followersChange: 3.5, // percentage
      viewershipChange: 5.2, // percentage
    };
  }
  
  // Fetch recent streams with performance data
  export async function fetchRecentStreams(username, limit = 5) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return mock data
    return [
      { 
        id: 'stream1', 
        title: "Let's Play: New Releases", 
        viewers: 876, 
        duration: "4h 12m",
        date: "3 days ago",
        category: "Just Chatting",
        thumbnail: "/api/placeholder/320/180"
      },
      { 
        id: 'stream2', 
        title: "Q&A with Followers", 
        viewers: 1243, 
        duration: "2h 45m",
        date: "1 week ago",
        category: "Just Chatting",
        thumbnail: "/api/placeholder/320/180"
      },
      { 
        id: 'stream3', 
        title: "Community Games Night", 
        viewers: 934, 
        duration: "3h 30m",
        date: "2 weeks ago",
        category: "Games",
        thumbnail: "/api/placeholder/320/180"
      }
    ];
  }
  
  // Check if Twitch is connected
  export async function checkTwitchConnection() {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Randomly return connected or not for demo purposes
    return { connected: Math.random() > 0.5 };
  }
  
  // Connect to Twitch (mock implementation)
  export async function connectTwitch() {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would redirect to Twitch OAuth
    return { success: true };
  }