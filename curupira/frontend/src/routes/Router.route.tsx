import { Navigate, Route, Routes } from 'react-router-dom'
import { DefaultLayout } from '~/layouts/default/Default.layout'
import { HomePage } from '~/pages/home/Home.page'
import modules from './data/modules.data'
import PrivateRoute from './Private.route'

const Router = () => {
  return (
    <Routes>
      {/* dashboard */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DefaultLayout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<HomePage />} />
        {/* Rotas dos módulos */}
        {modules.map((module, index) => (
          <Route key={index} path={module.path}>
            {module.submodules.map((submodule, index) => {
              return (
                <Route
                  key={index}
                  path={submodule.path.replace('/', '')}
                  element={submodule.component}
                />
              )
            })}
          </Route>
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default Router
