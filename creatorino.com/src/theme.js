// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#212121', // Dark grey for surfaces (e.g. AppBar background)
      contrastText: '#ffffff', // White text for high contrast
    },
    secondary: {
      main: '#9b22b0', // Purple accent
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212', // Mostly dark background
      paper: '#1e1e1e',   // Slightly lighter dark for paper components
    },
    text: {
      primary: '#ffffff',  // Most text is white
      secondary: '#ce93d8', // Off text is a light purple
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
