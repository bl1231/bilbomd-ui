import { lazy } from 'react'

// project import
import Loadable from 'components/Loadable'
import MainLayout from 'layout/MainLayout'

// our Dave Gray redux Authentication wrapper
import RequireAuth from 'features/auth/RequireAuth'
import PersistLogin from 'features/auth/PersistLogin'
import { ROLES } from 'config/roles'

// render - dashboard
//const DashBoard = Loadable(lazy(() => import('features/dashboard/DashBoard')))
const Prefetch = Loadable(lazy(() => import('features/auth/Prefetch')))

// prettier-ignore
const NewJob = Loadable(lazy(() => import('features/jobs/NewJob')));
const ConstInpStepper = Loadable(
  lazy(() => import('components/ConstInpForm/ConstInpStepper'))
)

const JobsList = Loadable(lazy(() => import('features/jobs/JobsList')))
// prettier-ignore
const SingleJobPage = Loadable(lazy(() => import('features/jobs/SingleJobPage')));
const Welcome = Loadable(lazy(() => import('features/auth/Welcome')))
const UsersList = Loadable(lazy(() => import('features/users/UsersList')))
const EditUser = Loadable(lazy(() => import('features/users/EditUser')))
const UserAccount = Loadable(lazy(() => import('features/users/UserAccount')))

// ==============================|| MAIN ROUTING ||============================== //

const ProtectedMainRoutes = {
  element: <PersistLogin />,
  children: [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: 'welcome',
          element: <Welcome />
        },
        {
          element: <RequireAuth allowedRoles={[...Object.values(ROLES)]} />,
          children: [
            {
              element: <Prefetch />,
              children: [
                {
                  path: 'dashboard',
                  children: [
                    {
                      path: 'default',
                      element: <Welcome />
                    },
                    {
                      element: (
                        <RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />
                      ),
                      children: [
                        {
                          path: 'users',
                          element: <UsersList />
                        },
                        {
                          path: 'users/:id',
                          element: <EditUser />
                        }
                      ]
                    },
                    {
                      path: 'jobs',
                      element: <JobsList />
                    },
                    {
                      path: 'jobs/:id',
                      element: <SingleJobPage />
                    },
                    {
                      path: 'jobs/new',
                      element: <NewJob />
                    },
                    {
                      path: 'jobs/constinp',
                      element: <ConstInpStepper />
                    },
                    {
                      path: 'account',
                      element: <UserAccount />
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

export { ProtectedMainRoutes }
