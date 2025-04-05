// Supabase Edge Function for processing avatars

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.170.0/encoding/base64.ts";

// Define response headers for CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define input interface
interface AvatarProcessRequest {
  image: string;         // Base64 encoded image data
  filename: string;      // Original filename
  contentType: string;   // MIME type (e.g., "image/jpeg")
}

// For image processing, using Deno's standard library since ImageKit isn't directly available
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client with Auth context from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with the request auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the user from the request
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: userError?.message }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process the request data
    const { image, filename, contentType }: AvatarProcessRequest = await req.json();
    
    if (!image || !filename || !contentType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: image, filename, or contentType' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate image type
    if (!contentType.startsWith('image/')) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only images are allowed.' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Decode base64 image
    const base64Data = image.split(',')[1];
    const imageData = decode(base64Data);
    
    // Get file extension from content type
    const fileExt = contentType.split('/')[1];
    const userId = user.id;
    
    // Generate unique filenames for both sizes
    const largeFilename = `${userId}-L.${fileExt}`;
    const smallFilename = `${userId}-S.${fileExt}`;
    
    // Process the image using Deno's ImageScript library
    const originalImage = await Image.decode(imageData);
    
    // Process the large image (main profile image)
    const largeImage = originalImage.resize(400, 400);
    const largeImageBuffer = await largeImage.encode();
    
    // Process the small image (icon)
    const smallImage = originalImage.resize(80, 80);
    const smallImageBuffer = await smallImage.encode();
    
    // Create the avatar bucket if it doesn't exist
    try {
      const { data: bucketData, error: bucketError } = await supabaseClient
        .storage
        .getBucket('avatars');
        
      if (bucketError && bucketError.message.includes('not found')) {
        // Create bucket if it doesn't exist
        await supabaseClient.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
        });
      }
    } catch (error) {
      console.error("Error checking/creating bucket:", error);
    }
    
    // First, remove any existing avatars with the same name to clean up
    try {
      await supabaseClient.storage.from('avatars').remove([largeFilename, smallFilename]);
    } catch (error) {
      // Ignore errors here since files might not exist yet
      console.log("No existing files to remove or error removing");
    }
    
    // Upload the large image
    const { data: largeData, error: largeError } = await supabaseClient
      .storage
      .from('avatars')
      .upload(largeFilename, largeImageBuffer, {
        contentType,
        cacheControl: '3600',
        upsert: true
      });
      
    if (largeError) {
      throw largeError;
    }
    
    // Upload the small image
    const { data: smallData, error: smallError } = await supabaseClient
      .storage
      .from('avatars')
      .upload(smallFilename, smallImageBuffer, {
        contentType,
        cacheControl: '3600',
        upsert: true
      });
      
    if (smallError) {
      throw smallError;
    }
    
    // Get the public URLs for both images
    const largeUrl = supabaseClient.storage.from('avatars').getPublicUrl(largeFilename).data.publicUrl;
    const smallUrl = supabaseClient.storage.from('avatars').getPublicUrl(smallFilename).data.publicUrl;
    
    // Update the user's profile with the new avatar URLs
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .update({
        avatar_url: largeUrl,
        avatar_url_small: smallUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
      
    if (profileError) {
      throw profileError;
    }
    
    // Return success response with the URLs
    return new Response(
      JSON.stringify({ 
        success: true, 
        avatar_url: largeUrl, 
        avatar_url_small: smallUrl,
        profile: profileData
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (err) {
    console.error("Error processing avatar:", err);
    return new Response(
      JSON.stringify({ error: 'Failed to process image', details: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});