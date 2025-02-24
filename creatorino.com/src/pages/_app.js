// pages/_app.js
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    
        <Component {...pageProps} />
    
    </ThemeProvider>
  );
}

export default MyApp;
