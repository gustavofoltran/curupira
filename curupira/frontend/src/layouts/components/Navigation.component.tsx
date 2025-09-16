import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MailIcon from '@mui/icons-material/Mail'
import MenuIcon from '@mui/icons-material/Menu'
import {
  Badge,
  Box,
  CSSObject,
  CssBaseline,
  IconButton,
  Stack,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
  styled,
} from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import MuiDrawer from '@mui/material/Drawer'
import * as React from 'react'
import { MenuAccountUser } from './MenuAccountUser.component'

const drawerWidth = 240

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  maxWidth: `calc(100vw - 64px)`,
  ...(open && {
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: `calc(100% - ${drawerWidth}px)`,
    maxWidth: `calc(100vw - ${drawerWidth}px)`,
  }),
}))

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

interface HeaderDrawerProps {
  children: React.ReactNode
  window?: () => Window
  icon?: string
  iconColor: string
  appBarProps?: any
  companyName?: string
  userName?: string
  appsOptions?:
  | {
    name: string
  }[]
  | null
  sideBar: ({
    open,
    setOpen,
    expanded,
    setExpanded,
  }: {
    open: boolean
    setOpen: (value: boolean) => void
    expanded: string | false
    setExpanded: (value: string | false) => void
  }) => JSX.Element
  navigateToOnLogoClick?: string
}

export const Navigation = (props: HeaderDrawerProps) => {
  const { children, companyName, userName, sideBar } = props

  const [open, setOpen] = React.useState(false)
  const [expanded, setExpanded] = React.useState<string | false>(false)

  const handleDrawerOpen = () => {
    setOpen(!open)
    setExpanded(false)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div">
            {companyName}
          </Typography>
          <Stack
            ml="auto"
            direction={'row'}
            alignItems={'center'}
            justifyContent={'end'}
            gap={2}
          >
            <Tooltip title="Notificações">
              <IconButton>
                <Badge color="warning" badgeContent={100} componentsProps={{
                  badge: {
                    style: {
                      color: 'white',
                      fontWeight: 'bold'
                    }
                  },
                }}>
                  <MailIcon sx={{ color: 'white' }} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                color: 'white',
              }}
            >
              {userName}
            </Typography>
            <MenuAccountUser />
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer open={open} variant="permanent">
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
        </DrawerHeader>
        {sideBar({ open, setOpen, expanded, setExpanded })}
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  )
}
