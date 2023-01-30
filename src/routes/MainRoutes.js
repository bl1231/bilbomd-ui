import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
//const DashboardDefault = Loadable(lazy(() => import('components/Dashboard')));
const NewBilboMDJob = Loadable(
  lazy(() => import('components/Uploads/NewBilboMDJob'))
);
// render - sample page
//const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));
const JobTable = Loadable(lazy(() => import('pages/dashboard/JobTable')));

// render - utilities
//const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
//const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
//const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
//const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

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
      path: 'newjob',
      element: <NewBilboMDJob />
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
      path: 'jobtable',
      element: <JobTable />
    }
    // {
    //     path: 'shadow',
    //     element: <Shadow />
    // },
    // {
    //     path: 'typography',
    //     element: <Typography />
    // },
    // {
    //     path: 'icons/ant',
    //     element: <AntIcons />
    // }
  ]
};

export default MainRoutes;
