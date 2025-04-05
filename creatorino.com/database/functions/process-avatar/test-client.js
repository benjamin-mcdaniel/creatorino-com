// Client-side test script for the process-avatar Edge Function
// Note: This needs to be run with Node.js, not Deno

const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Configuration
const config = {
  // Use your deployed function URL
  functionUrl: 'https://your-project-ref.supabase.co/functions/v1/process-avatar',
  
  // Path to a test image file
  testImagePath: './test-image.jpg',
  
  // Your auth token (get this from browser after logging in)
  authToken: 'YOUR_AUTH_TOKEN'
};

async function testProcessAvatar() {
  try {
    // Read the image file
    const imageBuffer = fs.readFileSync(config.testImagePath);
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    
    console.log('Sending request to:', config.functionUrl);
    
    // Call the Edge Function
    const response = await fetch(config.functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.authToken}`
      },
      body: JSON.stringify({
        image: base64Image,
        filename: 'test-image.jpg',
        contentType: 'image/jpeg'
      })
    });
    
    // Parse response
    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response body:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\nSuccess! Avatar URLs:');
      console.log('Large:', result.avatar_url);
      console.log('Small:', result.avatar_url_small);
    } else {
      console.error('\nError processing avatar:', result.error);
      if (result.details) {
        console.error('Details:', result.details);
      }
    }
  } catch (error) {
    console.error('Error making request:', error);
  }
}

// Run the test
testProcessAvatar();

/*
INSTRUCTIONS:

1. Update config values at the top of this file
2. Install dependencies: npm install node-fetch form-data
3. Run this script: node test-client.js

To get your auth token:
1. Login to your app in the browser
2. Open developer tools (F12)
3. Go to Application tab > Local Storage > supabase.auth.token
4. Copy the access_token value
*/