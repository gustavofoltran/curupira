import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { useAuth } from '~/contexts/Auth.context'
import { Navigation } from '../components/Navigation.component'
import { Sidebar } from './Sidebar.layout'

export function DefaultLayout() {
  const { user } = useAuth()
  const { t } = useTranslation()

  return (
    <Navigation
      appBarProps={{
        sx: { backgroundColor: '#0D2D40' },
      }}
      icon={''}
      iconColor="white"
      companyName={user.company.name}
      userName={`${t('Olá')}, ${user.name}`}
      sideBar={Sidebar}
    >
      <Outlet />
    </Navigation>
  )
}
