import { Breakpoints } from '@mui/material'
import { createBreakpoints } from '@mui/system'

export const createThemeBreakpoints = (): Breakpoints => {
  return createBreakpoints(themeBreakpointsOptions)
}

const themeBreakpointsOptions = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
}
