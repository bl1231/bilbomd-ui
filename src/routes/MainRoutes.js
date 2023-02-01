import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// our Dave Gray redux Authentication wrapper
import RequireAuth from 'pages/authentication/RequireAuth';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
// prettier-ignore
const NewBilboMDJob = Loadable(lazy(() => import('components/Uploads/NewBilboMDJob')));

const JobTable = Loadable(lazy(() => import('pages/dashboard/JobTable')));
// prettier-ignore
const SingleJobPage = Loadable(lazy(() => import('pages/dashboard/SingleJobPage')));
const Welcome = Loadable(lazy(() => import('pages/authentication/Welcome')));
const UsersList = Loadable(lazy(() => import('pages/users/UsersList')));

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
      element: <NewBilboMDJob />
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
      element: <JobTable />
    }
  ]
};

const ProtectedMainRoutes = {
  element: <RequireAuth />,
  children: [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: <DashboardDefault />
        },
        {
          path: 'welcome',
          element: <Welcome />
        },
        {
          path: 'userslist',
          element: <UsersList />
        },
        {
          path: 'job',
          element: <NewBilboMDJob />
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
          element: <JobTable />
        }
      ]
    }
  ]
};

// export default MainRoutes;

export { MainRoutes, ProtectedMainRoutes };
