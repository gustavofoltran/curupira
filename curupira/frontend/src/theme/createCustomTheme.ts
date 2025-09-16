import { createTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import { ptBR } from '@mui/material/locale'
import {
  createThemeBreakpoints,
  createThemeComponents,
  createThemePalette,
} from './createThemeObjects'

// Docs @ https://mui.com/material-ui/customization/theming/#api

export const createCustomTheme = () => {
  const themePalette = createTheme({
    palette: {
      ...createThemePalette(),
      action: {
        disabled: grey[500],
      },
    },
  })

  return createTheme(
    {
      breakpoints: createThemeBreakpoints(),
      palette: {
        ...createThemePalette(),
        action: {
          disabled: grey[500],
        },
      },
      components: createThemeComponents(themePalette),
    },
    ptBR,
  )
}
