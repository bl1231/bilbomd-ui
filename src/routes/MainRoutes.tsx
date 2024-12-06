import { lazy } from 'react'

// project import
import Loadable from 'components/Loadable'
import MainLayout from 'layout/MainLayout'

// our Dave Gray redux Authentication wrapper
import RequireAuth from 'features/auth/RequireAuth'
import PersistLogin from 'features/auth/PersistLogin'
import { ROLES } from 'config/roles'

// render - dashboard
const Prefetch = Loadable(lazy(() => import('features/auth/Prefetch')))
const NewJob = Loadable(lazy(() => import('features/jobs/NewJob')))
const NewAutoJob = Loadable(
  lazy(() => import('features/autojob/NewAutoJobForm'))
)
const NewAlphaFoldJob = Loadable(
  lazy(() => import('features/alphafoldjob/NewAlphaFoldJobForm'))
)
const NewSANSJob = Loadable(
  lazy(() => import('features/sansjob/NewSANSJobForm'))
)
const NewScoperJob = Loadable(
  lazy(() => import('features/scoperjob/NewScoperJobForm'))
)
const NewMultiJob = Loadable(
  lazy(() => import('features/multimd/NewMultiMDJobForm'))
)
const ConstInpStepper = Loadable(
  lazy(() => import('components/ConstInpForm/ConstInpStepper'))
)
const AF2PAEJiffy = Loadable(lazy(() => import('features/af2pae/PAEJiffy')))
const Jobs = Loadable(lazy(() => import('features/jobs/Jobs')))
const SingleJobPage = Loadable(
  lazy(() => import('features/jobs/SingleJobPage'))
)
const Welcome = Loadable(lazy(() => import('features/auth/Welcome')))
const UsersList = Loadable(lazy(() => import('features/users/UsersList')))
const EditUser = Loadable(lazy(() => import('features/users/EditUser')))
const UserAccount = Loadable(lazy(() => import('features/users/UserAccount')))
const AdminPanel = Loadable(lazy(() => import('features/admin/AdminPanel')))
const Unauthorized = Loadable(lazy(() => import('components/Unauthorized')))
const Missing = Loadable(lazy(() => import('components/Missing')))

// ===========================|| MAIN ROUTING ||============================ //

const ProtectedMainRoutes = {
  element: <PersistLogin />,
  children: [
    {
      element: <MainLayout />,
      path: '/',
      children: [
        {
          path: 'welcome',
          element: <Welcome />
        },
        {
          element: <RequireAuth allowedRoles={[ROLES.Admin]} />,
          children: [
            {
              path: 'admin',
              element: <AdminPanel />
            }
          ]
        },
        {
          element: <RequireAuth allowedRoles={[...Object.values(ROLES)]} />,
          children: [
            {
              path: 'unauthorized',
              element: <Unauthorized />
            }
          ]
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
                    { path: '', element: <Welcome /> },
                    {
                      element: (
                        <RequireAuth
                          allowedRoles={[ROLES.Manager, ROLES.Admin]}
                        />
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
                      path: 'jobs/*',
                      element: <Jobs />,
                      children: [
                        {
                          index: true,
                          element: <Jobs />
                        }
                      ]
                    },
                    {
                      path: 'jobs/:id',
                      element: <SingleJobPage />
                    },
                    {
                      path: 'jobs/classic',
                      element: <NewJob />
                    },
                    {
                      path: 'jobs/auto',
                      element: <NewAutoJob />
                    },
                    {
                      path: 'jobs/alphafold',
                      element: <NewAlphaFoldJob />
                    },
                    {
                      path: 'jobs/sans',
                      element: <NewSANSJob />
                    },
                    {
                      path: 'jobs/scoper',
                      element: <NewScoperJob />
                    },
                    {
                      path: 'jobs/multimd',
                      element: <NewMultiJob />
                    },
                    {
                      path: 'jobs/constinp',
                      element: <ConstInpStepper />
                    },
                    {
                      path: 'af2pae',
                      element: <AF2PAEJiffy />
                    },
                    {
                      path: 'account',
                      element: <UserAccount />
                    }
                  ]
                },
                {
                  path: '*',
                  element: <Missing />
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
