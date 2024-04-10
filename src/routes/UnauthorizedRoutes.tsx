import { lazy } from 'react'

import Loadable from 'components/Loadable'

import RequireAuth from 'features/auth/RequireAuth'
import { ROLES } from 'config/roles'

const Unauthorized = Loadable(lazy(() => import('components/Unauthorized')))

const UnauthorizedRoutes = {
  element: <RequireAuth allowedRoles={[...Object.values(ROLES)]} />,
  children: [
    {
      path: 'unauthorized',
      element: <Unauthorized />
    }
  ]
}

export { UnauthorizedRoutes }
