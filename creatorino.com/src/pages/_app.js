// pages/_app.js
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import theme from '../utils/theme';
import '../styles/globals.css'; // For Tailwind CSS

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Configure persistent session
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Optional: Handle global auth state changes if needed
      console.log('Auth state changed:', event);
    });

    // Remove server-side injected CSS
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    
    // Add Inter font from Google Fonts
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(linkEl);

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;