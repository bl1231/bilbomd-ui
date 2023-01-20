import { createTheme } from '@mui/material';

// Create a light theme instance.
export const lightTheme = createTheme();

// Create a dark theme instance.
export const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});
