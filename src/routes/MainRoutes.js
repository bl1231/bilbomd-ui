import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// our Dave Gray redux Authentication wrapper
import RequireAuth from 'features/auth/RequireAuth';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('features/dashboard/DashBoard')));
// prettier-ignore
const NewJob = Loadable(lazy(() => import('features/jobs/NewJob')));

const JobsList = Loadable(lazy(() => import('features/jobs/JobsList')));
// prettier-ignore
const SingleJobPage = Loadable(lazy(() => import('features/dashboard/SingleJobPage')));
const Welcome = Loadable(lazy(() => import('features/auth/Welcome')));
const UsersList = Loadable(lazy(() => import('features/users/UsersList')));
const EditUser = Loadable(lazy(() => import('features/users/EditUser')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'job',
      element: <NewJob />
    },
    {
      path: 'job/:uuid',
      element: <SingleJobPage />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'jobs',
      element: <JobsList />
    }
  ]
};

const ProtectedMainRoutes = {
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
          path: 'dashboard',
          children: [
            {
              path: 'default',
              element: <DashboardDefault />
            },
            {
              path: 'users',
              element: <UsersList />
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
};

// export default MainRoutes;

export { MainRoutes, ProtectedMainRoutes };
