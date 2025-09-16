import { PaletteOptions } from '@mui/material'
import { grey, orange } from '@mui/material/colors'

export const createThemePalette = (): PaletteOptions => {
  return {
    primary: {
      main: '#236F9E',
      light: '#4A90E2',
      contrastText: '#F2F2F2',
    },
    secondary: {
      main: '#212730',
      contrastText: '#F5F6F8',
    },
    text: {
      primary: '#212730',
    },
    action: {
      disabledBackground: grey[500],
      disabled: grey[100],
    },
    background: {
      default: '#FFFFFF',
      paper: '#fbfcfe',
    },
    warning: {
      main: orange[600],
      light: orange[400],
      dark: orange[800],
    },
  }
}
