import { createTheme } from '@mui/material/styles';

// Professional & Unique Color Palette
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#4f46e5', // Indigo 600
      light: '#818cf8',
      dark: '#3730a3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0ea5e9', // Sky 500
      light: '#38bdf8',
      dark: '#0284c7',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#0f172a', // Slate 50 / Slate 900
      paper: mode === 'light' ? '#ffffff' : '#1e293b', // White / Slate 800
    },
    text: {
      primary: mode === 'light' ? '#1e293b' : '#f8fafc', // Slate 800 / Slate 50
      secondary: mode === 'light' ? '#64748b' : '#94a3b8', // Slate 500 / Slate 400
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    success: {
      main: '#10b981',
    },
    info: {
      main: '#3b82f6',
    },
  },
  typography: {
    fontFamily: [
      '"Inter"', 
      '"Plus Jakarta Sans"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontWeight: 700, letterSpacing: '-0.025em' },
    h3: { fontWeight: 700, letterSpacing: '-0.025em' },
    h4: { fontWeight: 700, letterSpacing: '-0.025em' },
    h5: { fontWeight: 600, letterSpacing: '-0.015em' },
    h6: { fontWeight: 600, letterSpacing: '-0.015em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          },
        },
      },
    },
  },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
