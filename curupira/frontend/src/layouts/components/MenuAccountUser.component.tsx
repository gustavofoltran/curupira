import { useState } from 'react'

import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Logout from '@mui/icons-material/Logout'
import { Avatar, List, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { I18nFlags } from '~/components/I18n/I18nFlags.component'
import { useAuth } from '~/contexts/Auth.context'
import { ModalUserSettings } from './ModalUserSettings.component'

export const MenuAccountUser = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <Avatar
        onClick={(event) => {
          handleClick(event)
        }}
      >
        G
      </Avatar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: styles.paper,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <List>
          <ModalUserSettings />
          <MenuItem
            onClick={() => {
              // window.open('https://www.oneos.com.br/support/', '_blank')
            }}
            data-cy="help-menu-item"
          >
            <ListItemIcon>
              <HelpOutlineIcon fontSize="small" />
            </ListItemIcon>
            Ajuda
          </MenuItem>
          <MenuItem onClick={handleLogout} data-cy="exit-menu-item">
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Sair
          </MenuItem>

          <I18nFlags />
        </List>
      </Menu>
    </>
  )
}

const styles = {
  paper: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  },
}
