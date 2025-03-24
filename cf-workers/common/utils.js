/**
 * Common utilities for Cloudflare Workers API
 */

// Supabase client creation
export function createSupabaseClient() {
  // Access environment variables from Cloudflare Worker environment
  const SUPABASE_URL = SUPABASE_URL || '';
  const SUPABASE_KEY = SUPABASE_KEY || '';
  
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
}

/**
 * Extract user ID from authentication token in request
 */
export async function getUserIdFromToken(request) {
  // Get token from Authorization header
  const authHeader = request.headers.get('Authorization');
  let token = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }
  
  if (!token) {
    throw new Error('Unauthorized');
  }
  
  // Get user from token
  const supabase = createSupabaseClient();
  const { data: userData } = await supabase.auth.getUser(token);
  
  if (!userData?.user) {
    throw new Error('No user found');
  }
  
  return userData.user.id;
}

/**
 * Standard response headers
 */
export const standardHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

/**
 * Create a standard JSON response
 */
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: standardHeaders
  });
}

/**
 * Create an error response
 */
export function errorResponse(message, status = 500) {
  return jsonResponse({ error: message }, status);
}
