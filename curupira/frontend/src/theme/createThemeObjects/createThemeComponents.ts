import { Components, Theme } from '@mui/material'
import { grey } from '@mui/material/colors'

export const createThemeComponents = (theme: Theme): Components<Theme> => {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '0.4em',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: grey[300],
            outline: 'none',
            borderRadius: 4,
          },
          backgroundColor: 'background.paper',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          ':-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.default} inset !important`,
            WebkitTextFillColor: `${theme.palette.text.primary} !important`,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          height: '78px',
          width: '100%',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          height: 40,
          paddingInline: 40,
          paddingBlock: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingRight: '1.5rem',
          paddingLeft: '1.5rem',
          gap: 8,
          // '&:focus': {
          //   backgroundColor: '#C5D4E6',
          // },
          // '&:selected': {
          //   backgroundColor: '#C5D4E6',
          // },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F0F4F8',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          margin: '16px 0',
          boxShadow:
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '0.4rem 2rem',
          whiteSpace: 'nowrap',
        },
        head: {
          color: '#212730',
          fontWeight: 'bold',
        },
        body: {
          color: 'text.primary',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          height: 'fit-content',
        },
        h1: {
          fontWeight: 700,
          fontSize: '3rem',
          letterSpacing: '-0.01562em',
        },
        h2: {
          fontWeight: 700,
          fontSize: '2.5rem',
          letterSpacing: '-0.00833em',
        },
        h3: {
          fontWeight: 700,
          fontSize: '2rem',
          letterSpacing: '0em',
        },
        h4: {
          fontWeight: 700,
          fontSize: '1.5rem',
        },
        h5: {
          fontWeight: 700,
          fontSize: '1rem',
        },
        h6: {
          fontWeight: 700,
          fontSize: '0.9rem',
        },
        body1: {
          fontWeight: 500,
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
        },
        body2: {
          fontWeight: 500,
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          color: theme.palette.primary.main,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '2rem',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '1rem',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          color: grey[500],
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          height: 40,
          border: `1px solid ${grey[500]}`,
          borderColor: grey[500],
          '&.Mui-selected': {
            backgroundColor: '#E5E7EB',
            color: '#212730',
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#E5E7EB',
            color: '#212730',
          },
        },
      },
    },
    MuiTablePagination: {
      defaultProps: {
        rowsPerPageOptions: [5, 10, 25, 50],
        component: 'div',
      } as any,
    },
    MuiChip: {
      styleOverrides: {
        root: {
          width: 'fit-content',
          backgroundColor: '#F2F2F2',
          borderColor: '#D3D9D9',
          borderWidth: 2,
          borderStyle: 'solid',
        },
      },
    },
    MuiTabs: {
      variants: [
        {
          props: { variant: 'standard' },
          style: {
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: '500',
              fontSize: '14px',
              lineHeight: '1.5rem',
              minWidth: 'auto',
              padding: '0 1.2rem',
              transition: 'color 0.2s ease-in-out',
              '&:hover': {
                color: theme.palette.text.primary,
              },
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            },
          },
        },
        {
          props: { variant: 'scrollable' },
          style: {
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: '500',
              fontSize: '14px',
              lineHeight: '1.5rem',
              minWidth: 'auto',
              padding: '0 1.2rem',
              transition: 'color 0.2s ease-in-out',
              '&:hover': {
                color: theme.palette.text.primary,
              },
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            },
          },
        },
      ],
    },
  }
}
