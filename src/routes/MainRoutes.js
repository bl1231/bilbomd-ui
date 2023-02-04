import { lazy } from 'react'

// project import
import Loadable from 'components/Loadable'
import MainLayout from 'layout/MainLayout'

// our Dave Gray redux Authentication wrapper
import RequireAuth from 'features/auth/RequireAuth'

// render - dashboard
const DashBoard = Loadable(lazy(() => import('features/dashboard/DashBoard')))
const Prefetch = Loadable(lazy(() => import('features/auth/Prefetch')))
// prettier-ignore
const NewJob = Loadable(lazy(() => import('features/jobs/NewJob')));

const JobsList = Loadable(lazy(() => import('features/jobs/JobsList')))
// prettier-ignore
const SingleJobPage = Loadable(lazy(() => import('features/jobs/SingleJobPage')));
const Welcome = Loadable(lazy(() => import('features/auth/UnAuthWelcome')))
const UsersList = Loadable(lazy(() => import('features/users/UsersList')))
const NewUserForm = Loadable(lazy(() => import('features/users/NewUserForm')))
const EditUser = Loadable(lazy(() => import('features/users/EditUser')))

// ==============================|| MAIN ROUTING ||============================== //

const ProtectedMainRoutes = {
  //element: <RequireAuth />,
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
          element: <Prefetch />,
          children: [
            {
              path: 'dashboard',
              children: [
                {
                  path: 'default',
                  element: <DashBoard />
                },
                {
                  path: 'users',
                  element: <UsersList />
                },
                {
                  path: 'users/new',
                  element: <NewUserForm />
                },
                {
                  path: 'users/:id',
                  element: <EditUser />
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
                  //element: <NewJobForm />
                  element: <NewJob />
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

const ProtectedMainRoutes2 = {
  //element: <RequireAuth />,
  children: [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: <Welcome />
        },
        {
          element: Prefetch,
          children: [
            {
              path: 'dashboard',
              children: [
                {
                  path: 'default',
                  element: <DashBoard />
                },
                {
                  path: 'users',
                  element: <UsersList />
                },
                {
                  path: 'users/new',
                  element: <NewUserForm />
                },
                {
                  path: 'users/:id',
                  element: <EditUser />
                },
                {
                  path: 'jobs',
                  element: <JobsList />
                },
                {
                  path: 'jobs/:uuid',
                  element: <SingleJobPage />
                },
                {
                  path: 'jobs/new',
                  //element: <NewJobForm />
                  element: <NewJob />
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
// export default MainRoutes;

export { ProtectedMainRoutes }
