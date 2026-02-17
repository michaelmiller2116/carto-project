import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      light: '#333333',
      dark: '#000000',
    },
    secondary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#e0e0e0',
    },
    error: {
      main: '#ff3d00',
      light: '#ff6e40',
      dark: '#dd2c00',
    },
    warning: {
      main: '#ffb300',
      light: '#ffc107',
      dark: '#ff8f00',
    },
    info: {
      main: '#03a9f4',
      light: '#29b6f6',
      dark: '#0288d1',
    },
    success: {
      main: '#00bfa5',
      light: '#1de9b6',
      dark: '#00897b',
    },
    background: {
      default: '#ffffff',
      paper: '#f6f6f6',
    },
    text: {
      primary: '#111111',
      secondary: 'rgba(0, 0, 0, 0.7)',
      disabled: 'rgba(0, 0, 0, 0.45)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    action: {
      active: 'rgba(0, 0, 0, 0.65)',
      hover: 'rgba(0, 0, 0, 0.06)',
      selected: 'rgba(0, 0, 0, 0.12)',
      disabled: 'rgba(0, 0, 0, 0.3)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  },
  typography: {
    fontFamily: "'Helvetica Now', sans-serif",
    h1: {
      fontWeight: 300,
    },
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 0,
  },
  transitions: {
    duration: {
      standard: 300,
    },
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        filledError: {
          backgroundColor: '#fff4f4',
          color: '#b71c1c',
          border: '1px solid #ff3d00',
          borderRadius: '4px',
          '& .MuiAlert-icon, & .MuiAlert-action': {
            color: '#b71c1c',
          },
        },
        filledWarning: {
          backgroundColor: '#fff8e1',
          color: '#8a4b00',
          border: '1px solid #ffb300',
          borderRadius: '4px',
          '& .MuiAlert-icon, & .MuiAlert-action': {
            color: '#ff8f00',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          '&.node': {
            border: '1px solid black',
            minHeight: '150px',
            width: '150px',
            borderRadius: '4px',
          },
          '&.node.selected': {
            borderColor: '#1976d2',
            boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.25)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
    },
  },
})

export default theme
