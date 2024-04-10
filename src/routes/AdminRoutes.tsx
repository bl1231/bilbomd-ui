import { lazy } from 'react'
import Loadable from 'components/Loadable'
import RequireAuth from 'features/auth/RequireAuth'
import { ROLES } from 'config/roles'

const AdminPanel = Loadable(lazy(() => import('features/admin/AdminPanel')))

const AdminRoutes = {
  element: <RequireAuth allowedRoles={[ROLES.Admin]} />,
  children: [
    {
      path: 'admin',
      element: <AdminPanel />
    }
  ]
}

export { AdminRoutes }
