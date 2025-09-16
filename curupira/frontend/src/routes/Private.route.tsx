import { Navigate } from 'react-router-dom'
import { LoadingSplashScreen } from '~/components/Loading/LoadingSplashScreen.component'
import { useAuth } from '~/contexts/Auth.context'

function PrivateRoute({ children }: any) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSplashScreen />
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate
      to="/login"
      state={{
        returnTo: window.location.pathname,
        search: window.location.search,
      }}
    />
  )
}

export default PrivateRoute
