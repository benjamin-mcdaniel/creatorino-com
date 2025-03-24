/**
 * Profile API Worker
 * 
 * Handles server-side profile operations that were previously done on the client.
 * This allows moving sensitive operations server-side while maintaining a static front-end.
 */

// Access environment variables from Cloudflare Worker environment
// Using environment variables directly from worker (set in wrangler.toml or Cloudflare Dashboard)
const SUPABASE_URL = SUPABASE_URL || '';
const SUPABASE_KEY = SUPABASE_KEY || '';

// Create a Supabase client (simplified version)
const createClient = () => {
  // Verify that environment variables are properly set
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase environment variables are not properly configured');
  }
  
  return {
    auth: {
      getUser: async (token) => {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': SUPABASE_KEY
          }
        });
        
        if (!response.ok) throw new Error('Failed to get user');
        return response.json();
      }
    },
    from: (table) => {
      return {
        select: (columns = '*') => {
          let params = new URLSearchParams();
          if (columns !== '*') params.append('select', columns);
          
          return {
            eq: async (column, value) => {
              params.append(`${column}`, `eq.${value}`);
              
              const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
                headers: {
                  'apikey': SUPABASE_KEY,
                  'Content-Type': 'application/json'
                }
              });
              
              if (!response.ok) throw new Error(`Failed to query ${table}`);
              return response.json();
            },
            single: () => {
              params.append('limit', '1');
              return this;
            }
          };
        },
        update: (data) => {
          return {
            eq: async (column, value) => {
              const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}`, {
                method: 'PATCH',
                headers: {
                  'apikey': SUPABASE_KEY,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              });
              
              if (!response.ok) throw new Error(`Failed to update ${table}`);
              return response.json();
            }
          };
        },
        insert: async (data) => {
          const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_KEY,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
          });
          
          if (!response.ok) throw new Error(`Failed to insert into ${table}`);
          return response.json();
        }
      };
    },
    storage: {
      from: (bucket) => {
        return {
          upload: async (path, file) => {
            // This is simplified and would need to be expanded for actual file upload
            const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_KEY,
                'Content-Type': file.type
              },
              body: file
            });
            
            if (!response.ok) throw new Error('Failed to upload file');
            return response.json();
          },
          getPublicUrl: (path) => {
            return {
              data: {
                publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
              }
            };
          }
        };
      }
    }
  };
};

/**
 * Fetch the profile of a user
 */
async function fetchUserProfile(userId) {
  try {
    const supabase = createClient();
    
    // Try to fetch existing profile
    const existingProfile = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    // If profile exists, return it
    if (existingProfile && existingProfile.length > 0) {
      return { data: existingProfile[0], error: null };
    }
    
    // Profile doesn't exist, create a new one
    console.log('Creating new profile for user', userId);
    
    const newProfile = {
      id: userId,
      first_name: '',
      last_name: '',
      nickname: '', // You would need the email from auth context
      bio: '',
      avatar_url: '',
      updated_at: new Date().toISOString()
    };
    
    const createdProfile = await supabase
      .from('profiles')
      .insert([newProfile]);
      
    return { data: createdProfile[0], error: null };
  } catch (error) {
    console.error('Error with profile:', error.message);
    return { data: null, error };
  }
}

/**
 * Update the profile of a user
 */
async function updateUserProfile(userId, updates) {
  try {
    const supabase = createClient();
    
    // Add updated_at timestamp
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const result = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('id', userId);
      
    return { data: result[0], error: null };
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return { data: null, error };
  }
}

/**
 * Handle API requests
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // CORS headers for preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      }
    });
  }
  
  // Get token from Authorization header
  const authHeader = request.headers.get('Authorization');
  let token = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }
  
  // If no token, return error
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  try {
    // Get user from token
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser(token);
    
    if (!userData?.user) {
      throw new Error('No user found');
    }
    
    const userId = userData.user.id;
    
    // Simplified path handling for dedicated worker
    // Since this worker only handles profile requests, we don't need complex path routing
    if (request.method === 'GET') {
      const result = await fetchUserProfile(userId);
      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } 
    else if (request.method === 'PUT') {
      const updates = await request.json();
      const result = await updateUserProfile(userId, updates);
      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Handle other endpoints
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Event listener for fetch events
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});