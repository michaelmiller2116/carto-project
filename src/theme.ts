import { createTheme, type PaletteOptions } from '@mui/material/styles'

type ThemeMode = 'light' | 'dark'

const lightPalette: PaletteOptions = {
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
}

const darkPalette: PaletteOptions = {
  mode: 'dark',
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
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  action: {
    active: 'rgba(255, 255, 255, 0.7)',
    hover: 'rgba(255, 255, 255, 0.08)',
    selected: 'rgba(255, 255, 255, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
  },
}

export const getTheme = (mode: ThemeMode = 'dark') =>
  createTheme({
    palette: mode === 'light' ? lightPalette : darkPalette,
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
  })

const theme = getTheme('dark')

export default theme
